import Lottie from "lottie-react";
import animation404 from "../components/Animation/Animation404.json";

export default function ErrorPage() {
  return (
    <>
      <div style={{ marginTop: -180 }}></div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Lottie animationData={animation404}/>
      </div>
      <div style={{ marginTop: -350 }}></div>
    </>
  );
}