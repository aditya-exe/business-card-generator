import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase.config";

type DataType = {
  name: string,
  email: string,
  phoneNumber: string,
  businessName: string,
  businessAddress: string,
  websiteUrl: string,
  coOrdinates: string,
  image: string,
}

const Card = () => {
  if (typeof window === "undefined") {
    return
  }

  const getData = async () => {
    const docId = window.location.href.substring(27);
    const colRef = collection(db, "businesses");
    const docData = await getDoc(doc(db, "businesses", docId));
    if (docData.exists()) {
      const xx = await docData.data();
      const x: DataType = {
        name: "",
        email: "",
        phoneNumber: "",
        businessName: "",
        businessAddress: "",
        websiteUrl: "",
        coOrdinates: "",
        image: ""
      };
      x.name = xx.name;
      x.email = xx.email;
      x.phoneNumber = xx.phoneNumber;
      x.businessName = xx.businessName;
      x.businessAddress = xx.businessAddress;
      x.websiteUrl = xx.websiteUrl;
      x.coOrdinates = xx.coOrdinates;
      x.image = xx.image;
      // console.log(x);
      return await x;
    }
  }
  const x = getData();
  console.log(x);

  return (
    <>

    </>
  )
};

export default Card;