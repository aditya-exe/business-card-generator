import { type NextPage } from "next";
import Head from "next/head";
import { useForm, SubmitHandler } from "react-hook-form";
import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/router";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/firebase.config";
import { exportAsImage } from "../utils/exportAsImage";


type Inputs = {
  name: string,
  email: string,
  phoneNumber: number,
  businessName: string,
  websiteUrl: string,
  businessAddress: string,
  coOrdinates: string,
};

type ImageIp = Inputs & { logo?: any }

const Home: NextPage = () => {
  const router = useRouter();
  // const [email, setEmail] = useState(window.localStorage.getItem("emailForSignIn") || "");
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<any>("");
  const { register, handleSubmit, reset, formState, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<Inputs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [cardData, setCardData] = useState<ImageIp>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // console.log(data);
    sendPost(data);
  };

  const sendPost = async (data: Inputs) => {
    if (loading) {
      return;
    }
    setLoading(true);

    let toSendData: ImageIp = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      businessName: data.businessName,
      businessAddress: data.businessAddress,
      websiteUrl: data.websiteUrl,
      coOrdinates: data.coOrdinates,
      logo: undefined,
    }

    const docRef = await addDoc(collection(db, "businesses"), {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      businessName: data.businessName,
      businessAddress: data.businessAddress,
      websiteUrl: data.websiteUrl,
      coOrdinates: data.coOrdinates,
    });


    const imageRef = ref(storage, `businesses/${docRef.id}/image`);

    if (selectedFile !== undefined && selectedFile !== null) {
      // if (selectedFile.toString.length > 0) {
      if (selectedFile) {
        await uploadString(imageRef, selectedFile, "data_url").then(async () => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "businesses", docRef.id), {
            image: downloadURL,
          })
        });
        toSendData.logo = selectedFile;
      }
    }

    setCardData(toSendData);
    setSelectedFile("");
    setLoading(false);
    // router.push(`/card/${docRef.id}`);
    setSent(true);
  }

  const addImageToPost = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files !== null) {
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result !== undefined) {
        setSelectedFile(readerEvent.target?.result);
      }
    }
    // if (e.target.files && e.target.files[0] !== undefined)
    //   setSelectedFile(URL.createObjectURL(e.target.files[0]));
  }

  // useEffect(() => {
  //   if (formState.isSubmitSuccessful) {
  //     reset({
  //       name: "",
  //       email: "",
  //       businessName: "",
  //       businessAddress: "",
  //       websiteUrl: "",
  //       phoneNumber: NaN,
  //       coOrdinates: "",
  //     })
  //   }
  // }, [formState, reset]);

  return (
    <>
      <Head>
        <title>Business Card Generator</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {sent ?
          <Card data={cardData as ImageIp} />
          :
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Sign up your <span className="text-[hsl(280,100%,70%)]">Business</span>
            </h1>

            <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white min-w-[700px]">
              <h3 className="text-2xl font-bold">Enter your details</h3>
              <div className="flex gap-x-44">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-3">
                  <input {...register("name", { required: true })} type="text" placeholder={`${errors.name ? "Name Required" : "Name"}`} className={`w-[300px] p-2 rounded-xl placeholder:font-bold placeholder:text-zinc-500 bg-transparent active:bg-transparent focus:outline-0 ${errors.name ? "ring-1 ring-red-600" : ""}`} disabled={isSubmitting} />

                  <input {...register("email", { required: true })} type="email" placeholder={`${errors.email ? "Email Required" : "Email"}`} className={`p-2 rounded-xl placeholder:font-bold placeholder:text-zinc-500 bg-transparent active:bg-transparent  focus:outline-0 ${errors.email ? "ring-1 ring-red-600" : ""}`} disabled={isSubmitting} />

                  <input {...register("phoneNumber", { required: true })} type="number" placeholder={`${errors.phoneNumber ? "Phone Number Required" : "Phone Number"}`} className={`p-2 rounded-xl placeholder:font-bold placeholder:text-zinc-500 bg-transparent active:bg-transparent  focus:outline-0 ${errors.phoneNumber ? "ring-1 ring-red-600" : ""}`} disabled={isSubmitting} />

                  <input {...register("businessName", { required: true })} type="text" placeholder={`${errors.businessName ? "Business Name Required" : "Business Name"}`} className={`p-2 rounded-xl placeholder:font-bold placeholder:text-zinc-500 bg-transparent active:bg-transparent  focus:outline-0 ${errors.businessName ? "ring-1 ring-red-600" : ""}`} disabled={isSubmitting} />

                  <input {...register("businessAddress", { required: true })} type="text" placeholder={`${errors.businessAddress ? "Business Adress Required" : "Business Adress"}`} className={`p-2 rounded-xl placeholder:font-bold placeholder:text-zinc-500 bg-transparent  active:bg-transparent focus:outline-0 ${errors.businessAddress ? "ring-1 ring-red-600" : ""}`} disabled={isSubmitting} />

                  <input {...register("websiteUrl", { required: true })} type="text" placeholder={`${errors.websiteUrl ? "Website URL Required" : "Website URL"}`} className={`p-2 rounded-xl placeholder:font-bold placeholder:text-zinc-500 bg-transparent active:bg-transparent  focus:outline-0 ${errors.websiteUrl ? "ring-1 ring-red-600" : ""}`} disabled={isSubmitting} />

                  <input {...register("coOrdinates", { required: true })} type="text" placeholder={`${errors.coOrdinates ? "Co-Ordinates Required" : "Co-Ordinates"}`} className={`p-2 rounded-xl placeholder:font-bold placeholder:text-zinc-500 bg-transparent active:bg-transparent  focus:outline-0 ${errors.coOrdinates ? "ring-1 ring-red-600" : ""}`} disabled={isSubmitting} />

                  <div className="flex gap-x-2" >
                    <input type="submit" accept="image/*" className="rounded-xl p-2 font-extrabold bg-[hsl(280,100%,70%)] w-44 translate-x-24 cursor-pointer mt-3" />
                    {/* <button onClick={() => { router.push("/login") }} className="rounded-xl p-2 font-extrabold bg-[hsl(280,100%,70%)] w-44 translate-x-24 cursor-pointer mt-3">Login Instead</button> */}
                  </div>
                </form>

                {selectedFile ? (
                  <div className="relative w-[200px] h-[350px] flex items-center justify-center outline-dashed rounded-xl">
                    <p className="absolute cursor-pointer translate-y-[-150px] translate-x-[70px]" onClick={() => setSelectedFile("")}>X</p>
                    <img src={selectedFile} className={`${loading && "animate-pulse"}`} alt={"selected file"} />
                  </div>
                ) : (
                  <div onClick={() => {
                    if (filePickerRef !== null) filePickerRef.current?.click()
                  }} className="items-center justify-center flex outline-dashed bg-white/10 cursor-pointer w-[200px] h-[350px] rounded-xl translate-y-[-1%] mr-2">
                    <div>
                      Add Logo
                      <input type="file" hidden ref={filePickerRef} onChange={(e) => addImageToPost(e)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      </main>
    </>
  );
};

export default Home;

const Card = ({ data }: { data: ImageIp }) => {
  const exportRef = useRef();

  

  return (
    <div className="text-white items-center justify-center flex flex-col gap-y-10 ">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Your <span className="text-[hsl(280,100%,70%)]">Business</span> Card
      </h1>
      {/* {console.log(data.logo)} */}
      <div ref={exportRef} className="w-[800px] h-[400px] bg-black bg-gradient-to-r from-slate-600 to-slate-900 rounded-xl">
        <header className="rounded-xl justify-center flex text-gray-300 items-center h-20 tracking-tighter font-bold text-4xl">
          <span className="ml-4">
            {data.businessName}
          </span>

          {/* <img src="/favicon.ico" className="mr-5" alt="" /> */}
        </header>

        <div className=" flex justify-between">
          <div className=" max-w-fit ml-[55px] text-3xl font-bold tracking-tighter p-2 mt-4  text-gray-400">
            <li>{data.name}</li>
            <li>{data.email}</li>
            <li>{data.phoneNumber}</li>
            <li>{data.businessAddress}</li>
            <li>{data.websiteUrl}</li>
            <li>{data.coOrdinates}</li>
          </div>
          <div className="mt-4 mr-5 w-[260px] items-center justify-center  flex">
            <img src={data.logo} className="mr-5 p-2 overflow-hidden" alt="" />
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button className="p-2 bg-purple-600 rounded-xl font-bold tracking-tighter" onClick={() => exportAsImage(exportRef.current, "test", "download")}>Download!</button>
        <button className="p-2 bg-purple-600 rounded-xl font-bold tracking-tighter" onClick={() => exportAsImage(exportRef.current, "test", "share")}>Share on whatsapp</button>
      </div>
    </div>
  );
};