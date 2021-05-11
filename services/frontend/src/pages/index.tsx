import Layout from "../components/Layout/Index";
import FileUploader from "../components/UI/FileUploader";

export default function Home() {
  return (
    <Layout>
      <h4> Import Articles </h4>
      <FileUploader endpoint="/api/import_articles" />
      <hr />
      <h4> Import Products </h4>
      <FileUploader endpoint="/api/import_products" />
    </Layout>
  );
}
