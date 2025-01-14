import { ChatBox } from "@/components/custom/ChatBox";

export default function Home() {
  const id = Math.random().toString(20).substring(5,15);
    return (
      <div>
        <ChatBox peerId={id}/>
      </div>
    );
}
