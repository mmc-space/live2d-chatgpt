import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { debounce } from '@src/renderer/src/utils'
import LegacyRender from './Legacy'
import CurrentRender from './Current'
import Toolbar from './Toolbar'
import Tips, { TipsType } from './Tips'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from '../../store'

const Wrapper = styled.div<{ border: boolean; isLock: boolean }>`
  ${(props) => (props.border ? 'border: 2px dashed #ccc;' : 'padding: 2px;')}
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  ${(props) => (!props.isLock ? '-webkit-app-region: drag;' : '')}
`

const getCavSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

const Model: FC = () => {
  const {
    modelPath: originModelPath,
    resizable,
    useGhProxy,
    language,
  } = useSelector((state: RootState) => ({
    ...state.config,
    ...state.win,
  }))

  const modelPath =
    useGhProxy && originModelPath.startsWith('http')
      ? `https://ghproxy.com/${originModelPath}`
      : originModelPath

  const dispatch = useDispatch<Dispatch>()

  // 显示 工具栏
  const [toolShow, setToolShow] = useState(false)
  const [isLock, setIsLock] = useState(false)

  const [tips, setTips] = useState<TipsType>({
    text: '',
    priority: -1,
    timeout: 0,
  })

  const [cavSize, setCavSize] =
    useState<{ width: number; height: number }>(getCavSize)

  useEffect(() => {
    ;(window as any).setSwitchTool = dispatch.win.setSwitchTool
    ;(window as any).setLanguage = dispatch.win.setLanguage
    ;(window as any).nextModel = dispatch.config.nextModel
    ;(window as any).prevModel = dispatch.config.prevModel
  }, [])

  useEffect(() => {
    const handleDragOver = (evt: DragEvent): void => {
      evt.preventDefault()
    }
    const handleDrop = async (evt: DragEvent) => {
      evt.preventDefault()

      const files = evt.dataTransfer?.files

      if (!files) {
        return
      }

      const paths = []
      for (let i = 0; i < files.length; i++) {
        const result = await window.bridge.getModels(files[i])
        paths.push(...result)
      }

      console.log('modelList: ', paths)

      if (paths.length > 0) {
        const models = paths.map((p) => `file://${p}`)

        dispatch.config.setModelList(models)
        dispatch.config.setModelPath(models[0])
      }
    }

    document.body.addEventListener('dragover', handleDragOver)
    document.body.addEventListener('drop', handleDrop)

    return () => {
      document.body.removeEventListener('dragover', handleDragOver)
      document.body.removeEventListener('drop', handleDrop)
    }
  }, [])

  useLayoutEffect(() => {
    const resizeCanvas = debounce(() => {
      setCavSize(getCavSize())
    })

    window.addEventListener('resize', resizeCanvas, false)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  useEffect(() => {
    const handleBlur = () => {
      if (resizable) {
        dispatch.win.setResizable(false)
      }
    }

    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  const isMoc3 = modelPath.endsWith('.model3.json')

  const Render = isMoc3 ? CurrentRender : LegacyRender

  const handleMessageChange = (nextTips: TipsType) => {
    setTips(nextTips)
  }

  return (
    <Wrapper isLock={isLock} border={resizable}>
      <Tips {...tips}></Tips>
      <Toolbar
        show={toolShow}
        onLockClick={() => setIsLock((isLock) => !isLock)}
        onShowMessage={handleMessageChange}
      />
      <div onClick={() => setToolShow((toolShow) => !toolShow)}>
        <Render {...cavSize} modelPath={modelPath}></Render>
      </div>
    </Wrapper>
  )
}

export default Model
