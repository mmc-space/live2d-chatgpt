import { FC, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import Message, { Item, MessageType } from './Message'
import { TipsType } from './Tips'

const Form = styled.form`
  width: auto;
  padding: 0.5rem;

  border-radius: 0.25rem;
`

const Button = styled.button`
  background: #585a70;
  color: #fff;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.3rem;
  border: 0;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
`

const Input = styled.input`
  border: 0;
  padding: 0.25rem;

  &::placeholder {
    color: #9193b3;
  }

  &:focus {
    outline: 0;
  }
`

interface InputProps {
  placeholder?: string
  onShowMessage: (tips: TipsType) => void
}

const InputWapper: FC<InputProps> = (props) => {
  const { onShowMessage, placeholder = '输入消息..' } = props

  const lastMessageId = useRef('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Item[]>([])


  const pushMessage = (prompt: string, isAI?: boolean) =>
    setList((list) => [
      ...list,
      {
        content: prompt,
        messageType: isAI ? MessageType.AI : MessageType.User,
      },
    ])

  const showHitokoto = (text: string, priority: number, timeout: number) => {
    onShowMessage({ text, priority, timeout })
  }

  const handleSubmit = async () => {
    const prompt = inputRef.current?.value

    if (!prompt) return
    pushMessage(prompt)
    inputRef.current.value = ''
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        prompt,
        parentMessageId: lastMessageId.current,
      })

      const url = `https://mmc-cloud.up.railway.app/api/chat?${queryParams}`

      const data = await (await fetch(url)).json()

      const { text, id } = data as { text: string; id: string }

      lastMessageId.current = id

      pushMessage(text, true)
    } catch (error) {
      console.error('api 出错 请联系毛毛虫')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Input placeholder={placeholder} ref={inputRef} dir="auto" />
        <Button disabled={loading} type="submit">
          发送
        </Button>
      </Form>
      <Message list={list} loading={loading} />
    </>
  )
}

export default InputWapper
