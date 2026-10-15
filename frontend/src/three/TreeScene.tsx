import { Sparkles } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { useTheme } from '../theme/ThemeProvider'
import { GrowthTree } from './GrowthTree'
import { treeState } from './treeState'

/** Moves the tree with the pointer and scroll; shifts it right on wide screens */
function Rig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null!)
  const { size, camera } = useThree()
  const look = useRef(new THREE.Vector3(0, 2.6, 0))

  useFrame(({ clock }, delta) => {
    const k = 1 - Math.pow(0.001, delta) // frame-rate independent smoothing
    const wide = size.width >= 1024
    const g = group.current
    // Drifts right while scrolling, so it sits behind the summary card in "About"
    const x = wide ? 2.4 + treeState.scroll * 1.6 : size.width >= 640 ? 2.2 : 0
    g.position.x = THREE.MathUtils.lerp(g.position.x, x, k)
    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      treeState.mx * 0.35 + treeState.scroll * 1.1 + clock.elapsedTime * 0.04,
      k,
    )
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2.6 + treeState.scroll * 1.6 - treeState.my * 0.3, k)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, (wide ? 9.5 : 11.5) + treeState.scroll * 0.6, k)
    look.current.set(wide ? 1.2 : 0, 2.4 + treeState.scroll * 1.1, 0)
    camera.lookAt(look.current)
  })

  return <group ref={group}>{children}</group>
}

function Island({ dark }: { dark: boolean }) {
  return (
    <group position={[0, -0.32, 0]}>
      <mesh>
        <cylinderGeometry args={[2.3, 1.4, 0.6, 9, 1]} />
        <meshStandardMaterial color={dark ? '#1c2230' : '#dfe3ee'} roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.3, 9]} />
        <meshStandardMaterial color={dark ? '#262d40' : '#c9d0f7'} roughness={1} flatShading />
      </mesh>
    </group>
  )
}

export default function TreeScene({ active }: { active: boolean }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 2.6, 9.5], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <hemisphereLight args={[dark ? '#8196ff' : '#ffffff', dark ? '#0d1017' : '#e6e9fd', dark ? 0.7 : 1.15]} />
      <directionalLight position={[5, 9, 4]} intensity={dark ? 1.3 : 1.7} color={dark ? '#c4cdff' : '#fff4e8'} />
      <pointLight position={[-3, 3.5, 2.5]} intensity={dark ? 8 : 4} color="#e8742f" distance={10} />
      <Rig>
        <group scale={0.62}>
          <GrowthTree dark={dark} />
        </group>
        <Island dark={dark} />
        <Sparkles
          count={60}
          scale={[7, 6, 7]}
          position={[0, 3, 0]}
          size={3}
          speed={0.35}
          opacity={0.7}
          color={dark ? '#f29a5e' : '#e8742f'}
        />
      </Rig>
    </Canvas>
  )
}
