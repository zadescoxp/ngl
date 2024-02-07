import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PLay from "./PLay";
import Inbox from "./Inbox";
import Settings from "./Settings";
import { auth, usersCollection } from "@/firebase/firebaseConfig";
import { msgCollection } from "../../firebase/firebaseConfig";
import {
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
export function Tab() {
  const [unseenMessagesCount, setUnseenMessagesCount] = useState<number>(0);
  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const uid = doc(usersCollection, user.uid);

      const unseenMessagesQuery = query(
        msgCollection,
        where("seen", "==", false),
        where("ref", "==", uid),
        orderBy("seen"),
        limit(111)
      );

      onSnapshot(unseenMessagesQuery, (snapshot) => {
        const unseenMessagesCount = snapshot.size;
        setUnseenMessagesCount(unseenMessagesCount);
      });
    }
  }, []);

  return (
    <Tabs defaultValue="play" className="fade-in">
      <TabsList className="w-full bg-transparent py-2.5 rounded-none z-10 fixed top-0 bg-white h-fit items-center justify-between px-4 border-b">
        {unseenMessagesCount > 0 && (
          <h1 className=" font-extrabold text-[#EC1187]">
            {unseenMessagesCount > 99 && "99+ Unread"}{" "}
            {unseenMessagesCount < 99 && `${unseenMessagesCount} unread`}
          </h1>
        )}
        {unseenMessagesCount <= 0 && (
          <h1 className=" font-extrabold text-[#EC1187] h-8 w-8"></h1>
        )}
        <div className="">
          <TabsTrigger value="play">PLAY</TabsTrigger>
          <TabsTrigger value="inbox">
            INBOX
            {unseenMessagesCount > 0 && (
              <div className="rounded-full bg-red-500 h-3 w-3 ml-1"></div>
            )}
          </TabsTrigger>
        </div>
        <Settings />
      </TabsList>

      <TabsContent value="play" className="mt-[4.2rem]">
        <PLay />
      </TabsContent>

      <TabsContent value="inbox" className="mt-[4.5rem]">
        <Inbox />
      </TabsContent>
    </Tabs>
  );
}
