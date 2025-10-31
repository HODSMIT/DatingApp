export type Message = {
    id: string
    senderId: string
    senderDisplayName: string
    senderImageUrl: string
    receipientImageUrl: string
    receipientId: string
    receipientDisplayName: string
    content: string
    dataRead?: string
    messageSent: string
    currentUserSender?: boolean
}