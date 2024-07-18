// import "@/styles/globals.css";

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }


import "@/styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
// import { UseWalletProvider } from "use-wallet";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import "@fontsource/space-grotesk";
import { getETHPrice } from "@/lib/getETHPrice";
import { useAsync } from "react-use";
import useStore from "@/store";

const theme = extendTheme({
  fonts: {
    heading: "Space Grotesk",
    body: "Space Grotesk",
  },
});

function MyApp({ Component, pageProps }) {
  const { setEthPrice } = useStore()
  useAsync(async () => {
    try {
      const result = await getETHPrice();
      setEthPrice(result);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      <ChakraProvider theme={theme}>
        {/* <UseWalletProvider
          chainId={4}
          connectors={{
            walletconnect: {
              rpcUrl:
                "https://rinkeby.infura.io/v3/41f39700002a4807bd71bfadb241ab59",
            },
          }}
        >
        </UseWalletProvider> */}
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
