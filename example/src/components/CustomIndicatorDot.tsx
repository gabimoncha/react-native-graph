import React, { useCallback } from 'react'
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Group, RoundedRect, Shadow } from '@shopify/react-native-skia'
import { SelectionDotProps } from '../../../src/LineGraphProps'

const BORDER_SIZE = 20
const RECT_SIZE = 12

export function IndicatorDot({
  isActive,
  circleX,
  circleY,
}: SelectionDotProps): React.ReactElement {
  const indicatorOpacity = useSharedValue(1)

  const setIsActive = useCallback(
    (active: boolean) => {
      indicatorOpacity.value = withSpring(!active ? 1 : 0, {
        mass: 1,
        stiffness: 1000,
        damping: 50,
        velocity: 0,
      })
    },
    [indicatorOpacity]
  )

  useAnimatedReaction(
    () => isActive.value,
    (active) => {
      runOnJS(setIsActive)(active)
    },
    [isActive, setIsActive]
  )

  const borderX = useDerivedValue(() => circleX.value - BORDER_SIZE / 2)
  const borderY = useDerivedValue(() => circleY.value - BORDER_SIZE / 2)

  const rectX = useDerivedValue(() => circleX.value - RECT_SIZE / 2)
  const rectY = useDerivedValue(() => circleY.value - RECT_SIZE / 2)

  return (
    <Group>
      <RoundedRect
        x={borderX}
        y={borderY}
        width={BORDER_SIZE}
        height={BORDER_SIZE}
        r={6}
        color="#ffffff"
        opacity={indicatorOpacity}
      >
        <Shadow dx={2} dy={2} color="rgba(0,0,0,0.2)" blur={4} />
      </RoundedRect>
      <RoundedRect
        x={rectX}
        y={rectY}
        width={RECT_SIZE}
        height={RECT_SIZE}
        r={8}
        color={'#ff0000'}
        opacity={indicatorOpacity}
      />
    </Group>
  )
}
