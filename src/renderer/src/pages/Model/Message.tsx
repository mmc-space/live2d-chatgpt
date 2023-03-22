import { FC, useMemo } from 'react'
import styled from 'styled-components'

export enum MessageType {
  User,
  AI,
}

export interface Item {
  content: string
  messageType: MessageType
}

interface IProps {
  loading?: boolean
  list: Item[]
}

const ChatBody = styled.div`
  padding: 20px;
  background-size: cover;
  background-repeat: repeat;
  max-height: 500px;
  height: 100%;
  overflow-x: hidden;
  opacity: 0.9;
`

const Typing = styled.div`
  align-items: center;
  display: flex;
  height: 17px;
`

const Dot = styled.div`
  @keyframes typingAnimation {
    0% {
      transform: translateY(0px);
      background-color: rgba(20, 105, 69, 0.7);
    }
    28% {
      transform: translateY(-7px);
      background-color: rgba(20, 105, 69, 0.4);
    }
    44% {
      transform: translateY(0px);
      background-color: rgba(20, 105, 69, 0.2);
    }
  }

  animation: typingAnimation 1.8s infinite ease-in-out;
  background-color: rgba(20, 105, 69, 0.7);
  border-radius: 50%;
  height: 7px;
  margin-right: 4px;
  vertical-align: middle;
  width: 7px;
  display: inline-block;
`

const Container = styled.div`
  max-width: calc(100% - 120px);
  padding: 7px 14px 6px;
  border-radius: 0.5rem;
  position: relative;

  z-index: 2;
  box-shadow: rgb(0 0 0 / 13%) 0px 1px 0.5px;

  p {
    font-size: 14px;
    line-height: 20px;
    margin-top: 4px;
    margin-bottom: 0;
    color: #111111;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  span {
    display: flex;
    margin-top: 4px;
    font-size: 12px;
    line-height: 16px;
    color: rgb(17 17 17 / 50%);
    justify-content: flex-end;
  }
`

const MessageItem = styled.div<{ isAi: boolean }>`
  margin: 4px;
  display: flex;
  ${(props) => `justify-content: ${props.isAi ? 'start' : 'end'}`}
`

const Message: FC<IProps> = (props) => {
  const { list, loading } = props

  const timeNow = useMemo(
    () =>
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    [],
  )

  return (
    <>
      {list.length ? (
        <ChatBody>
          {list.map((item, index) => {
            const isAI = item.messageType === MessageType.AI
            return (
              <MessageItem isAi={isAI} key={index}>
                <Container style={{ maxWidth: `calc(100% - 120px)` }}>
                  {/* <span className={css.triangle} /> */}
                  {/* <span className={css.accountName}>{accountName}</span> */}
                  <p>{item.content}</p>
                  <span>{timeNow}</span>
                </Container>
              </MessageItem>
            )
          })}
          {loading && (
            <div style={{ backgroundColor: '#32373a' }}>
              <Typing>
                <Dot />
                <Dot />
                <Dot />
              </Typing>
            </div>
          )}
        </ChatBody>
      ) : null}
    </>
  )
}

export default Message
