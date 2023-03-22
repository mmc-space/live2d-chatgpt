import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Dispatch, RootState } from '../../store'
import InputWapper from './Input'
import { TipsType } from './Tips'

interface ToolbarProps {
  show?: boolean
  onShowMessage: (tips: TipsType) => void
  onLockClick: () => void
}

const Container = styled.div<{ show?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 50px;
  text-align: center;
  justify-content: center;
  width: 100%;
  color: #aaa;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  position: absolute;

  ${(props) => `opacity: ${!props.show ? 1 : 0}`}
`

const Wrapper = styled.div`
  transition: opacity 1s;
  display: flex;
  justify-content: center;

  & span {
    margin: 0 0.5rem;
    color: #6a6a6a;
    display: block;
    line-height: 30px;
    text-align: center;
    transition: color 0.3s;
    cursor: pointer;

    &:hover {
      color: #fa0;
    }
  }
`

const Toolbar: FC<ToolbarProps> = ({ show, onShowMessage, onLockClick }) => {
  const dispatch = useDispatch<Dispatch>()
  const { resizable } = useSelector((state: RootState) => ({
    ...state.config,
    ...state.win,
  }))

  const loadOtherModel = () => {
    dispatch.config.nextModel()
  }

  const setResizable = () => {
    dispatch.win.setResizable(!resizable)
  }

  const toolList = [
    {
      name: 'user',
      icon: 'user-circle',
      call: loadOtherModel,
    },
    { name: 'square', icon: 'square-o', call: setResizable },
    // 禁止拖动
    { name: 'lock', icon: 'info-circle', call: onLockClick },
  ]

  return (
    <Container show={show}>
      <Wrapper>
        {toolList.map((item) => {
          const { name, icon, call } = item
          return (
            <span
              onClick={call}
              key={name}
              className={`fa fa-lg fa-${icon}`}
            ></span>
          )
        })}
      </Wrapper>

      {/* <InputWapper onShowMessage={onShowMessage} /> */}
    </Container>
  )
}

export default Toolbar
