import Layout from "@/components/Layout";


export default function Home() {
  return (
    <Layout>
      <div className="flex-grow p-4 ">
        <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
        <p>Here is some content on the page.</p>
      </div>
    </Layout>
  );
}
