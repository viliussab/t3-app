import type { NextPage } from "next";
import { Base64File } from "../../../types/dto/Base64File";
import { trpc } from "../../../utils/trpc";
import Layout from "../../components/Layout";

const downloadBase64File = (file: Base64File) => {
  const linkSource = `data:${file.contentType};base64,${file.data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = file.fileName;
  downloadLink.click();
};

const Home: NextPage = () => {
  const query = trpc.useQuery(["campaign.generatePdf", {id: "d"}],
    {
      onSuccess: (file) => {
        downloadBase64File(file);
      }
    }
  );

  return (
    <Layout>
      <div>Main page</div>
    </Layout>
  );
};

export default Home;
