import { useCallback, useEffect, useState } from "react";
import { json, useLoaderData } from '@remix-run/node';
import {DatePicker} from '@shopify/polaris';
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  TextField,
  InlineGrid,
  Icon,
  BlockStack,
  Collapsible,
  Bleed,
  Divider,
  DataTable,
  Box
} from "@shopify/polaris";
import axios from 'axios';
import { authenticate } from "../shopify.server";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import {  CustomersMajor, DropdownMinor } from '@shopify/polaris-icons';

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data.productCreate.product,
  });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );

  const [value, setValue] = useState('Hi, John nice to know you');

  const handleChange = useCallback(
    (newValue) => setValue(newValue),
    [],
  );

  const [firebaseDB, setFirebaseDB] = useState(null);
  const firebaseConfig = {
    databaseURL: 'https://rdbex2-default-rtdb.asia-southeast1.firebasedatabase.app'
  };
  const app = initializeApp(firebaseConfig);
  const Firedatabase = getDatabase(app);

  useEffect(() => {
    const fetchDbFirebase = () => {
      const databaseRef = ref(Firedatabase, '/messages');
      onValue(databaseRef, (snapshot) => {
        const fetchedData = snapshot.val();
        setFirebaseDB(fetchedData);
      });
    };

    fetchDbFirebase();

    return () => {
      const databaseRef = ref(Firedatabase, '/messages');
      off(databaseRef);
    };
  }, []);
  // }

  console.log(firebaseDB);

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);
  const generateProduct = () => submit({}, { replace: true, method: "POST" });

  const [openCollapsible, setOpenCollapsible] = useState(false);

  const handleToggle = useCallback(() => setOpenCollapsible((openCollapsible) => !openCollapsible), []); 

  return (
    <Page>
      <Layout>
      <Box padding="400">
        <Text variant="heading3xl" as="h2">
          App store dashboard
        </Text>
      </Box>
      <InlineGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="400">
      <Box>
      <Box background="bg-surface-secondary">
        <Layout.Section>
        <Card>
        <InlineGrid columns={{ xs: 1, md: "20px 1fr" }} gap="100">
        <Icon
          source={CustomersMajor}
          tone="base"
        />
        <Text variant="headingMd" as="h6">
          Customer@mail
        </Text>
        </InlineGrid>
        <p>Use for detail pages, which should have pagination and breadcrumbs, and also often have several actions.</p>
        </Card>
        <Box>
        <Button
          css={{marginTop: "1rem",}}
          textAlign="left"
          disclosure={openCollapsible ? 'up' : 'down'}
          onClick={() => handleToggle(!openCollapsible)}
        >
          {openCollapsible ? 'Show less' : 'Reply'}
        </Button>
        </Box>
        </Layout.Section>
        <Collapsible
          open={openCollapsible}
          id="basic-collapsible"
          transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
          expandOnPrint
        >
          <Layout.Section>
          <TextField
            label="Send Message to Customer"
            value={value}
            onChange={handleChange}
            multiline={4}
            autoComplete="off"
          />
          </Layout.Section>
          <Layout.Section>
            <Button variant="primary">Send</Button>
          </Layout.Section>
        </Collapsible>
      </Box>
      </Box>
      <Box>
        <Card roundedAbove="sm">
          <BlockStack gap="400">
            <Box border="divider" borderRadius="base" minHeight="2rem" />
            <Box>
              <Bleed marginInline={{ xs: 400, sm: 500 }}>
                <Divider />
              </Bleed>
            </Box>
          </BlockStack>
        </Card> 
      </Box>
      </InlineGrid>
      </Layout>
    </Page>
  );
}
