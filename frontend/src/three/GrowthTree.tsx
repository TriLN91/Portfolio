import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { growth } from './treeState'

const MAX_DEPTH = 6
const LEAVES_PER_TIP = 6
const BLOSSOMS = 16
const UP = new THREE.Vector3(0, 1, 0)

type Branch = { parent: number; depth: number; q: THREE.Quaternion; length: number; radius: number; phase: number }
type Leaf = { tip: number; offset: THREE.Vector3; rot: THREE.Euler; size: number; delay: number }

/** Small deterministic RNG so the tree has the same shape on every visit */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildTree(seed: number) {
  const rng = mulberry32(seed)
  const branches: Branch[] = []
  const tips: number[] = []

  const add = (parent: number, depth: number, dir: THREE.Vector3, length: number, radius: number) => {
    const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize())
    const idx = branches.push({ parent, depth, q, length, radius, phase: rng() * Math.PI * 2 }) - 1
    if (depth >= MAX_DEPTH) {
      tips.push(idx)
      return
    }
    const count = depth === 0 ? 3 : rng() < 0.4 ? 3 : 2
    const spin = rng() * Math.PI * 2
    for (let i = 0; i < count; i++) {
      const az = spin + (i / count) * Math.PI * 2 + (rng() - 0.5) * 0.6
      // The first child of low branches continues upward, so the tree gets a tall leader
      const tilt = i === 0 && depth < 3 ? 0.1 + rng() * 0.15 : 0.4 + rng() * 0.4 + depth * 0.03
      let perp = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(Math.cos(az), 0, Math.sin(az)))
      if (perp.lengthSq() < 1e-4) perp = new THREE.Vector3(1, 0, 0)
      perp.normalize()
      const child = dir.clone().applyAxisAngle(perp, tilt).lerp(UP, 0.12).normalize()
      add(idx, depth + 1, child, length * (0.7 + rng() * 0.15), radius * 0.66)
    }
  }
  add(-1, 0, UP.clone(), 1.9, 0.2)

  const leaves: Leaf[] = []
  for (const tip of tips) {
    for (let i = 0; i < LEAVES_PER_TIP; i++) {
      const offset = new THREE.Vector3(rng() - 0.5, rng() - 0.35, rng() - 0.5).multiplyScalar(0.6)
      leaves.push({
        tip,
        offset,
        rot: new THREE.Euler(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI),
        size: 0.07 + rng() * 0.08,
        delay: rng() * 0.45,
      })
    }
  }

  const blossoms: Leaf[] = []
  for (let i = 0; i < BLOSSOMS; i++) {
    const tip = tips[Math.floor(rng() * tips.length)]
    blossoms.push({
      tip,
      offset: new THREE.Vector3(rng() - 0.5, rng() * 0.3, rng() - 0.5).multiplyScalar(0.5),
      rot: new THREE.Euler(rng(), rng(), rng()),
      size: 0.06 + rng() * 0.04,
      delay: rng() * 0.6,
    })
  }

  return { branches, tips, leaves, blossoms }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)
const easeOutBack = (x: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

const PALETTE = {
  light: { bark: '#3a3140', leaves: ['#2f47e8', '#4258ee', '#6a7ef4', '#1f33b8', '#93a2f8'], blossom: '#e8742f' },
  dark: { bark: '#8a7d78', leaves: ['#8196ff', '#6d84ff', '#a9b6ff', '#4f63e0', '#c4cdff'], blossom: '#f29a5e' },
}

export function GrowthTree({ dark }: { dark: boolean }) {
  const data = useMemo(() => buildTree(11), [])
  const branchRef = useRef<THREE.InstancedMesh>(null!)
  const leafRef = useRef<THREE.InstancedMesh>(null!)
  const blossomRef = useRef<THREE.InstancedMesh>(null!)

  const geo = useMemo(() => {
    const branch = new THREE.CylinderGeometry(0.68, 1, 1, 7, 1)
    branch.translate(0, 0.5, 0) // pivot at the base so scale.y grows the branch upward
    return {
      branch,
      leaf: new THREE.IcosahedronGeometry(1, 0),
      blossom: new THREE.OctahedronGeometry(1, 0),
    }
  }, [])

  // Scratch objects reused every frame
  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      sway: new THREE.Quaternion(),
      e: new THREE.Euler(),
      s: new THREE.Vector3(),
      p: new THREE.Vector3(),
      d: new THREE.Vector3(),
      origin: new THREE.Vector3(),
      tipPos: data.branches.map(() => new THREE.Vector3()),
      color: new THREE.Color(),
    }),
    [data],
  )

  const palette = dark ? PALETTE.dark : PALETTE.light

  useLayoutEffect(() => {
    const mesh = leafRef.current
    data.leaves.forEach((_, i) => {
      mesh.setColorAt(i, tmp.color.set(palette.leaves[i % palette.leaves.length]))
    })
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [data, palette, tmp])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const g = growth()
    const { m, q, sway, e, s, p, d, origin, tipPos } = tmp

    // Branches grow depth by depth; each one starts from its parent's current tip
    const span = MAX_DEPTH + 1.5
    data.branches.forEach((b, i) => {
      const local = easeOutCubic(clamp01(g * span - b.depth))
      const base = b.parent < 0 ? origin : tipPos[b.parent]
      const amp = 0.014 * b.depth * local
      e.set(Math.sin(t * 0.9 + b.phase) * amp, 0, Math.cos(t * 0.7 + b.phase) * amp)
      sway.setFromEuler(e)
      q.copy(sway).multiply(b.q)
      d.copy(UP).applyQuaternion(q)
      const len = b.length * local
      tipPos[i].copy(base).addScaledVector(d, len)
      const r = local > 0 ? b.radius * (0.35 + 0.65 * local) : 0
      s.set(r, len, r)
      m.compose(base, q, s)
      branchRef.current.setMatrixAt(i, m)
    })
    branchRef.current.instanceMatrix.needsUpdate = true

    // Leaves pop in once the outer branches exist
    const leafPhase = clamp01((g - 0.5) / 0.42)
    data.leaves.forEach((leaf, i) => {
      const k = clamp01((leafPhase - leaf.delay) / 0.55)
      const size = k > 0 ? leaf.size * easeOutBack(k) : 0
      p.copy(tipPos[leaf.tip]).add(leaf.offset)
      e.set(leaf.rot.x + Math.sin(t + i) * 0.15, leaf.rot.y + t * 0.1, leaf.rot.z)
      q.setFromEuler(e)
      s.setScalar(size)
      m.compose(p, q, s)
      leafRef.current.setMatrixAt(i, m)
    })
    leafRef.current.instanceMatrix.needsUpdate = true

    // Orange blossoms appear only when the tree is almost fully grown
    const bloomPhase = clamp01((g - 0.82) / 0.18)
    data.blossoms.forEach((bl, i) => {
      const k = clamp01((bloomPhase - bl.delay * 0.5) / 0.5)
      const size = k > 0 ? bl.size * easeOutBack(k) * (1 + Math.sin(t * 2 + i) * 0.08) : 0
      p.copy(tipPos[bl.tip]).add(bl.offset)
      e.set(t * 0.6 + i, t * 0.4, 0)
      q.setFromEuler(e)
      s.setScalar(size)
      m.compose(p, q, s)
      blossomRef.current.setMatrixAt(i, m)
    })
    blossomRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={branchRef} args={[geo.branch, undefined, data.branches.length]} frustumCulled={false}>
        <meshStandardMaterial color={palette.bark} roughness={0.85} flatShading />
      </instancedMesh>
      <instancedMesh ref={leafRef} args={[geo.leaf, undefined, data.leaves.length]} frustumCulled={false}>
        <meshStandardMaterial roughness={0.45} metalness={0.1} flatShading />
      </instancedMesh>
      <instancedMesh ref={blossomRef} args={[geo.blossom, undefined, data.blossoms.length]} frustumCulled={false}>
        <meshStandardMaterial
          color={palette.blossom}
          emissive={palette.blossom}
          emissiveIntensity={dark ? 0.6 : 0.25}
          roughness={0.4}
          flatShading
        />
      </instancedMesh>
    </group>
  )
}
