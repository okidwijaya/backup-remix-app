import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  Icon,
  InlineGrid,
  TextField,
  Collapsible,
  Bleed,
  Divider
} from "@shopify/polaris";
import {
  CustomersMajor
} from '@shopify/polaris-icons';
import { authenticate } from "../shopify.server";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Form } from "@remix-run/react";

const firebaseConfig = {
  apiKey: "AIzaSyBp2zTmcW0kyPmwYv9KFVaRV_B2AaL1fZU",
  authDomain: "rdbex2.firebaseapp.com",
  databaseURL: "https://rdbex2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rdbex2",
  storageBucket: "rdbex2.appspot.com",
  messagingSenderId: "539346832741",
  appId: "1:539346832741:web:b373e52431f2942d3c258c",
  measurementId: "G-J2ZVEK3SEY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
  const [chatData, setChatData] = useState([]);

  const [openCollapsibles, setOpenCollapsibles] = useState(Array(chatData.length).fill(true));

  const handleToggle = useCallback(
    (index) => {
      setOpenCollapsibles((prevOpenCollapsibles) => {
        const newOpenCollapsibles = [...prevOpenCollapsibles];
        newOpenCollapsibles[index] = !newOpenCollapsibles[index];
        return newOpenCollapsibles;
      });
    },
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const documents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
        setChatData(documents);
        console.log(documents);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };

    fetchData();
  }, [db]);

  // console.log('chatdata: ', chatData)
  
  const [chatFormData, setChatFormData] = useState(
    Array.from({ length: chatData.length }, (_, index) => ({ 
      content: "",
      createdat: "",
      orderid: chatData[index].id,
      ordernumber: "",
      orderurl: "",
      useremail: "",
      userid: "",
      contents:[
          {
              admincontent: "",
              createdat: "",
              orderid: chatData[index].id
          },
          {
              usercontent: "",
              createdat: "",
              orderid: ""
          }
      ]
    }))
  );


  const handleChatChange = useCallback(
    (newStoreName, index) => {
      setChatFormData((prevChatFormData) => {
        const newFormData = [...prevChatFormData];
        newFormData[index] = { ...newFormData[index], admincontent: newStoreName };
        return newFormData;
      });
    },
    [],
  );

  const postChatData = async (index) => {
    try {
      // const docRef = await addDoc(collection(db, 'users'), chatFormData[index]);
      // console.log('Document written with ID: ', docRef.id);
      const documentId = chatData[index].id;
      const docRef = doc(db, 'users', documentId);

      await updateDoc(docRef, {
        contents: arrayUnion({
          admincontent: chatFormData[index]?.admincontent || "",
          createdat: new Date(),
          orderid: chatData[index].id,
        }),
      });

      console.log('Document updated successfully.');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <Page fullWidth>
      <ui-title-bar title="Customer Chat">
      </ui-title-bar>
      <Layout fullWidth>
      <BlockStack gap={500}>
        <h2>Firestore Data</h2>
          {chatData.map((item, index) => (
            item.orderurl ?
            <Card key={item.id}>
      
              <Box>
                  <InlineGrid columns={{ xs: "20px 1fr", lg: "20px 1fr" }} gap="100">
                    <Icon
                      source={CustomersMajor}
                      tone="base"
                    />
                    <Text variant="headingMd" as="h5">
                    {item.useremail ? item.useremail  : item.orderid}
                    </Text>
                  </InlineGrid>
                  <Text>Content: {item.content}</Text>
                  <Layout.Section>
                  <BlockStack gap="100">
                  {item.contents && item.contents.length > 0 && (
                      item.contents.map(content => (
                        <Box key={content.createdat}>
                          {content.admincontent && 
                          <Card>
                            <Text>
                              Admin: {content.admincontent}
                            </Text>
                          </Card>
                          }

                          {content.usercontent && 
                          <Card>
                            <Text>
                              User: {content.usercontent}
                            </Text>
                          </Card>
                          }
                        </Box>
                      ))
                  )}
                  </BlockStack>
                  </Layout.Section>
                <Box>
                <Layout.Section>
                  <Button
                    textAlign="right"
                    disclosure={openCollapsibles[index] ? 'up' : 'down'}
                    onClick={() => handleToggle(index)}
                  >
                    {openCollapsibles[index] ? 'Reply' : 'Show Less'}
                  </Button>
                  </Layout.Section>
                </Box>

                <Collapsible
                  open={openCollapsibles[index]}
                  id={`basic-collapsible-${index}`}
                  transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                  expandOnPrint
                >
                  <Layout.Section>
                    <Form>
                      <Card gap="500">
                      <TextField
                        label="Reply to Customer"
                        multiline={4}
                        autoComplete="off"
                        className="input_textarea"
                        type="text"
                        id={`content-${index}`}
                        name={`content-${index}`}
                        value={chatFormData[index]?.admincontent || ''}
                        onChange={(newStoreName) => handleChatChange(newStoreName, index)}
                        required
                      ></TextField>
                      <Box>
                        <button
                          className="Polaris-Button"
                          type="button"
                          onClick={() => postChatData(index)}
                        >
                          Submit
                        </button>
                        </Box>
                      </Card>
                    </Form>
                  </Layout.Section>
                </Collapsible>
              </Box>

            </Card>
            : <Text key={item.id}></Text>
          ))}

      </BlockStack>
      </Layout>
    </Page>
  );
}

