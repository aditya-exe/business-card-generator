import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase.config";

const Card = () => {
  const router = useRouter();

  let docId = "";

  useEffect(() => {
    console.log(router.isReady);
    if (router.isReady) {
      // console.log(router.query);
      const { id } = router.query;
      docId = id as string;
    }
  }, [router.isReady])

  if (docId.length > 1) {
    const q = query(collection(db, "businesses"), where(docId as string, "==", true));
    const querySnapshot =  getDocs(q);
    Promise.resolve(querySnapshot).then((x)=>{
      console.log(x.docs);
    })
  }

  return (
    <>
      hello
    </>
  )
};

export default Card;