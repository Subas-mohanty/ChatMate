import { DataConnection, Peer } from "peerjs";
import { useCallback, useEffect, useState } from "react";

enum ConnectedStatus{
    "connected", 
    "connecting", 
    "disconnected"
}

type MessageType = "string" | "file";

interface Message{
    type : MessageType,
    sender : string,
    content : string
}

export const usePeerConnection = (peerId : string) => {

    const [peer, setPeer] = useState<Peer | null> (null);
    // storing connections in a kind of map, with key as peerId and value as its connection id
    const [connections, setConnections] = useState<{[peerId : string] : DataConnection}> ({});
    const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("disconnected");
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [connectedPeers, setConnectedPeers] = useState<string []>([]);

    useEffect(() => {
        const newPeer = new Peer(peerId);

        newPeer.on("open", () =>{
            setConnectionStatus("connected");
            setPeer(newPeer);
        })

        newPeer.on("connection", handleConnection);

        newPeer.on("error", (error) =>{
            console.log("Peer connection error", error);
            setConnectionStatus("disconnected");
        })
        return () =>{
            newPeer.destroy();
        }
    }, [peerId])

    const handleConnection = useCallback((conn : DataConnection) => {

        conn.on("open", () =>{
            setConnections((prevConnections) => ({...prevConnections, peerId : conn}));
            setConnectedPeers((prevConnctions) => [...prevConnctions, conn.peer])
            setConnectionStatus("connected")
        })
        conn.on("data", (data : any) => {
            const message : Message = {
                type : data.type,
                sender : conn.peer,
                content : data.content
            }
            setChatHistory((prevHistory) => [...prevHistory, message]);

        })

        conn.on("close", () => {
            setConnectionStatus("disconnected");
            setConnections((prevConnections) => {
                const updatedConnections = {...prevConnections};
                delete updatedConnections[conn.peer];
                return updatedConnections;
            });
            setConnectedPeers((prevPeers) => prevPeers.filter((p) => p !== conn.peer));
        })
    },[])
    const connectToRemotePeer = useCallback((remotePeerId : string) => {
        if(peer && !connections[remotePeerId]){
            const connection = peer.connect(remotePeerId);
            console.log(connection);
            handleConnection(connection);
        }
    },[peer, connections, handleConnection])
    const sendMessage = useCallback((content : string, type : MessageType = "string") => {
        const message = {content, sender : peerId, type};
        Object.values(connections).forEach((conn) => {
            conn.send(message);
        })
        setChatHistory((prevHistory) => [...prevHistory, message]);
    },[peerId, connections])


    return {
        connectedPeers,
        connectionStatus,
        chatHistory,
        sendMessage,
        connectToRemotePeer
    }
}