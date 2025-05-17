import { io } from 'socket.io-client'

// Create a socket instance
export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8002',
  {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'], // Add polling as fallback
  }
)

// Add event listeners for connection status
socket.on('connect', () => {
  console.log('Socket connected:', socket.id)
})

socket.on('disconnect', () => {
  console.log('Socket disconnected')
})

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error)
  // Try to reconnect automatically
  setTimeout(() => {
    if (!socket.connected) {
      console.log('Attempting to reconnect socket...')
      socket.connect()
    }
  }, 2000)
})

// Add a custom event to handle reconnection
socket.on('reconnect', (attemptNumber) => {
  console.log(`Socket reconnected after ${attemptNumber} attempts`)
})

// Add a custom event to handle reconnection failures
socket.on('reconnect_failed', () => {
  console.error('Socket reconnection failed')
  // Try one more time with a clean connection
  setTimeout(() => {
    console.log('Final reconnection attempt...')
    socket.connect()
  }, 5000)
})

// Helper functions for socket communication
export const emitEvent = (eventName: string, data: any) => {
  return new Promise((resolve, reject) => {
    if (!socket.connected) {
      socket.connect()
    }

    socket.emit(eventName, data, (response: any) => {
      if (response?.error) {
        reject(response.error)
      } else {
        resolve(response)
      }
    })
  })
}

export const onceEvent = (eventName: string) => {
  return new Promise((resolve) => {
    socket.once(eventName, (data: any) => {
      resolve(data)
    })
  })
}

// Export a function to ensure the socket is connected
export const ensureSocketConnected = () => {
  if (!socket.connected) {
    socket.connect()
  }
  return socket
}

// Function to join a specific channel or DM
export const joinChannel = (channelId: string) => {
  return emitEvent('join-channel', { channelId })
}

// Function to send a message
export const sendMessage = (message: any) => {
  return emitEvent('send-message', message)
}

// Function to send a DM
export const sendDirectMessage = (message: any) => {
  return emitEvent('send-dm', message)
}
