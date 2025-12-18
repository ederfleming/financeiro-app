import React from 'react'
import { ColorValue, View } from 'react-native'
import { styles } from './styles'

export default function Divider({color}:{color: ColorValue}) {
  return (
    <View style={[styles.container, {backgroundColor: color}]}/>
     
  )
}