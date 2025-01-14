'use client'

import { usePeerConnection } from "@/hooks/usePeer"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ChatBox(){
  const [peerId, setPeerId] = useState("");
    useEffect(() =>{
      setPeerId(Math.random().toString(20).substring(5,15));
    },[])
    const {
        connectedPeers,
        connectionStatus,
        chatHistory,
        sendMessage,
        connectToRemotePeer
    } = usePeerConnection(peerId);

    const [remoteId, setRemoteId] = useState(""); 
    const [message, setMessge] = useState("");

    //Todo : when a new message got added the user should see the most recent message, scroll to bottom
    // const messagesEndRef = useRef(null);
    // useEffect(() => {
    //     // Scroll to the bottom when chatHistory changes
    //     if (messagesEndRef.current) {
    //         // @ts-ignore
    //         messagesEndRef.current.scrollTop;
    //     }
    // }, [chatHistory]);

    function handleConnect(e : React.FormEvent){
        e.preventDefault();
        connectToRemotePeer(remoteId);
        setRemoteId("");
    }
    function handleSendMessage(e : React.FormEvent){
        e.preventDefault();
        sendMessage(message);
        setMessge("");
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
          <Card className="max-w-3xl mx-auto shadow-lg p-0">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-2xl font-bold">ChatMate, Your Ultimate Chatting App</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-lg font-bold mb-1 block">Your Peer ID</Label>
                    <span className="font-mono bg-gray-100 px-3 py-1 rounded text-sm">{peerId}</span>
                  </div>
                  <div>
                    <Label className="text-lg font-bold mb-1 block">Status</Label>
                    <span className={`px-3 py-1 rounded-full text-sm ${connectionStatus === "connected"? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {connectionStatus}
                    </span>
                  </div>
                </div>
                
                <div>
                  <form onSubmit={handleConnect} className="flex space-x-3">
                    <Input
                        placeholder="Enter remote Peer ID"
                        value={remoteId}
                        onChange={(e) => setRemoteId(e.target.value)}
                        className="flex-grow"
                        onSubmit={handleConnect}
                    />
                    <Button variant="default">Connect</Button>
                  </form>
                </div>
              </div>
    
              <div className="space-y-2">
                <Label className="text-lg font-bold">Connections:</Label>
                <div className=" p-3">
                  {connectedPeers.map((message, index) => (
                    <div key={index} className="text-sm py-1.5 border-b last:border-b-0">{message}</div>
                  ))}
                </div>
              </div>
    
              <div className="space-y-2">
                <Label className="text-lg font-bold">Messages</Label>
                <div className="mb-4 h-64 overflow-y-auto border p-2">
                    {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.sender === peerId ? 'text-right' : 'text-left'}`}>
                        <span className="text-sm font-semibold">{msg.sender}: </span>
                        {msg.type === 'string' ? (
                        msg.content
                        ) : (
                            <div></div>
                        //   <a href={msg.content} download={msg.fileName} className="text-blue-500 underline">
                        //     {msg.fileName}
                        //   </a>
                        )}
                    </div>
                    ))}
                </div>
              </div>
    
              <div>
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessge(e.target.value)}
                    className="flex-grow"
                    />
                    <Button className="px-6">Send</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )
}

