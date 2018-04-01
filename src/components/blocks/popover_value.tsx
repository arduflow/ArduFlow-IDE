import * as React from "react"
import { Tag, Popover } from 'antd'

export const PopoverValue = (props: {popoverElem: React.ReactNode, tagElem: React.ReactNode}) => 
    <Popover content={props.popoverElem}><Tag color="blue">{props.tagElem}</Tag></Popover>