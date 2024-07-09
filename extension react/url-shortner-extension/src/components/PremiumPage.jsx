import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { backendURL } from "../constants";
import { useAuthContext } from "../hooks/useAuthContext";

const PremiumPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async () => {
    try {
      const res = await fetch(backendURL + "/api/payment/premium", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: user.token,
        },
      });

      const data = await res.json();
      console.log(data);
      handlePaymentVerify(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePaymentVerify = async (data) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: user.email,
      description: "Premium",
      order_id: data.id,
      handler: async (response) => {
        console.log(response);
        try {
          const res = await fetch(backendURL + "/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: user.token,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await res.json();
          console.log(verifyData);

          if (verifyData.message === "Payment successful") {
            setPaymentSuccess(true);
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }
        } catch (err) {
          console.log(err);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Box
      p={8}
      maxWidth="600px"
      mx="auto"
      mt={10}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="2xl"
      bg="white"
    >
      <VStack spacing={6} textAlign="center">
        {paymentSuccess ? (
          <Heading size="2xl" color="blackAlpha.800">
            Payment Successful
          </Heading>
        ) : (
          <>
            <Heading size="2xl" color="blackAlpha.800">
              Premium Page
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Get premium features by buying the premium version of the
              extension.
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="blackAlpha.800">
              Features include:
            </Text>
            <List spacing={3} width="100%" textAlign="left">
              <ListItem fontSize="lg" color="gray.700">
                - Unlimited URL shortening
              </ListItem>
              <ListItem fontSize="lg" color="gray.700">
                - Custom URL
              </ListItem>
              <ListItem fontSize="lg" color="gray.700">
                - Analytics
              </ListItem>
            </List>
            <Text fontSize="2xl" fontWeight="bold" color="blackAlpha.800">
              Price: 2rs
            </Text>
            <Button
              onClick={handlePayment}
              colorScheme="blue"
              size="lg"
              width="full"
              variant="solid"
            >
              Buy
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default PremiumPage;
