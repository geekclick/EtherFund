import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useAsync } from "react-use";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    InputRightAddon,
    InputGroup,
    Alert,
    AlertIcon,
    AlertDescription,
    FormHelperText,
    Textarea,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ArrowBackIcon } from "@chakra-ui/icons";
// import { getETHPrice, getETHPriceInUSD } from "../../lib/getETHPrice";
import { ethers } from "ethers";
import factory from "@/smart-contract/factory";
import useSignerStore from "@/store/useSignerStore";

export default function NewCampaign() {
    const {
        handleSubmit,
        register,
        formState: { isSubmitting, errors },
    } = useForm({
        mode: "onChange",
    });
    const router = useRouter();
    const [error, setError] = useState("");
    const [minContriInUSD, setMinContriInUSD] = useState();
    const [targetInUSD, setTargetInUSD] = useState();
    const { signer, address, setSigner, setAddress } = useSignerStore()
    const connectWallet = async () => {
        const { provider, signer } = await connectToMetaMask();
        setSigner(signer);
        setAddress(await signer.getAddress())
    }

    async function onSubmit(data) {
        console.log(
            data.minimumContribution,
            data.campaignName,
            data.description,
            data.imageUrl,
            data.target
        );

        if (!signer) {
            setError("Please connect your wallet first.");
            return;
        }

        try {
            const factoryAddress = "0x68a5D6F439A3D9a22A6a729311DFb3A1d9ec5ea0";
            const factoryAbi = factory;
            const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, signer);

            const tx = await factoryContract.createCampaign(
                ethers.utils.parseUnits(data.minimumContribution, "ether"),
                data.campaignName,
                data.description,
                data.imageUrl,
                ethers.utils.parseUnits(data.target, "ether")
            );

            await tx.wait();
            router.push("/");
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    }

    return (
        <div>
            <Head>
                <title>New Campaign</title>
                <meta name="description" content="Create New Campaign" />
                <link rel="icon" href="/logo.svg" />
            </Head>
            <main>
                <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6}>
                    <Text fontSize={"lg"} color={"teal.400"}>
                        <ArrowBackIcon mr={2} />
                        <NextLink href="/"> Back to Home</NextLink>
                    </Text>
                    <Stack>
                        <Heading fontSize={"4xl"}>Create a New Campaign 📢</Heading>
                    </Stack>
                    <Box
                        rounded={"lg"}
                        bg={useColorModeValue("white", "gray.700")}
                        boxShadow={"lg"}
                        p={8}
                    >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={4}>
                                <FormControl id="minimumContribution">
                                    <FormLabel>Minimum Contribution Amount</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type="number"
                                            step="any"
                                            {...register("minimumContribution", { required: true })}
                                            isDisabled={isSubmitting}
                                            onChange={(e) => {
                                                setMinContriInUSD(Math.abs(e.target.value));
                                            }}
                                        />
                                        <InputRightAddon children="ETH" />
                                    </InputGroup>
                                    {minContriInUSD ? (
                                        <FormHelperText>
                                            {/* ~$ {getETHPriceInUSD(ETHPrice, minContriInUSD)} */}
                                        </FormHelperText>
                                    ) : null}
                                </FormControl>
                                <FormControl id="campaignName">
                                    <FormLabel>Campaign Name</FormLabel>
                                    <Input
                                        {...register("campaignName", { required: true })}
                                        isDisabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormControl id="description">
                                    <FormLabel>Campaign Description</FormLabel>
                                    <Textarea
                                        {...register("description", { required: true })}
                                        isDisabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormControl id="imageUrl">
                                    <FormLabel>Image URL</FormLabel>
                                    <Input
                                        {...register("imageUrl", { required: true })}
                                        isDisabled={isSubmitting}
                                        type="url"
                                    />
                                </FormControl>
                                <FormControl id="target">
                                    <FormLabel>Target Amount</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type="number"
                                            step="any"
                                            {...register("target", { required: true })}
                                            isDisabled={isSubmitting}
                                            onChange={(e) => {
                                                setTargetInUSD(Math.abs(e.target.value));
                                            }}
                                        />
                                        <InputRightAddon children="ETH" />
                                    </InputGroup>
                                    {targetInUSD ? (
                                        <FormHelperText>
                                            {/* ~$ {getETHPriceInUSD(ETHPrice, targetInUSD)} */}
                                        </FormHelperText>
                                    ) : null}
                                </FormControl>

                                {error ? (
                                    <Alert status="error">
                                        <AlertIcon />
                                        <AlertDescription mr={2}> {error}</AlertDescription>
                                    </Alert>
                                ) : null}
                                {errors.minimumContribution ||
                                    errors.name ||
                                    errors.description ||
                                    errors.imageUrl ||
                                    errors.target ? (
                                    <Alert status="error">
                                        <AlertIcon />
                                        <AlertDescription mr={2}>
                                            {" "}
                                            All Fields are Required
                                        </AlertDescription>
                                    </Alert>
                                ) : null}
                                <Stack spacing={10}>
                                    {!signer ? (
                                        <Button
                                            bg={"teal.400"}
                                            color={"white"}
                                            _hover={{
                                                bg: "teal.500",
                                            }}
                                            onClick={connectWallet}
                                        >
                                            Connect Wallet
                                        </Button>
                                    ) : (
                                        <Button
                                            bg={"teal.400"}
                                            color={"white"}
                                            _hover={{
                                                bg: "teal.500",
                                            }}
                                            isLoading={isSubmitting}
                                            type="submit"
                                        >
                                            Create
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </main>
        </div>
    );
}
