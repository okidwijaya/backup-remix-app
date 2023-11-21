import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
const mailchimpClient = require("@mailchimp/mailchimp_marketing");
import MailchimpSubscribe from "react-mailchimp-subscribe";
import axios from 'axios';
import { useState } from "react";

const url = "https://myshopify.us14.list-manage.com/subscribe/post?u=d60a23bd81d31217a2c6c64ec&id=af23a83d7f";
// import { createRequestHandler } from '@remix-run/node';
// import { HeadersInit } from 'node-fetch';



const SimpleForm = () => <MailchimpSubscribe url={url}/>


export default function AdditionalPage() {
  const [formData, setFormData] = useState({
    name: 'addnewmergefields5',
    type: 'text', 
    public: true, 
  });

  // const cspHeader= {
  //   'Content-Security-Policy': "frame-ancestors 'self' oki-playground.myshopify.com/;",
  // };

  const apiKey = "611a17640ff8eb94079458cf90d37782-us14";
  const serverPrefix = "us14"; 
  const audienceId = "af23a83d7f"; 

  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/merge-fields`;

  const config = {
    headers: {
      'Authorization': `apikey ${apiKey}`,
      // cspHeader,
    },
  };

  // const handleAddMergeField = async () => {
  //   try {
  //     const response = await axios.post(url, formData, config);
  //     console.log('Merge field added successfully:', response.data);
  //     console.log('Merge field added successfully:', response);
  //   } catch (error) {
  //     console.error('Failed to add merge field:', error);
  //   }
  // };


  // mailchimpClient.setConfig({
  //   apiKey: '611a17640ff8eb94079458cf90d37782',
  //   server: 'us14',
  // });
  
  // https://sy71rwjfce.execute-api.us-west-2.amazonaws.com/prod/store_rlcgy6w67yhctisbokfq

  // const apiKeyMailchimp = '611a17640ff8eb94079458cf90d37782-us14';
  // const serverPrefix = 'us14'; // e.g., us1
  // const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`;

//   const getAudience = async () => {
//     const response = await mailchimpClient.lists.getAllLists();
//     console.log(response);
//   };

//  getAudience();

  return (
    <Page>
      {/* <MailchimpSubscribe
        url={url}
        render={({ subscribe, status, message }) => (
          <div>
            <SimpleForm onSubmitted={formData => subscribe(formData)} />
            {status === "sending" && <div style={{ color: "blue" }}>sending...</div>}
            {status === "error" && <div style={{ color: "red" }} dangerouslySetInnerHTML={{__html: message}}/>}
            {status === "success" && <div style={{ color: "green" }}>Subscribed !</div>}
          </div>
        )}
      />
      <ui-title-bar title="Additional page" />
      <Layout>
        <Layout.Section>
        <div>
      <form onSubmit={handleAddMergeField}>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <button type="submit">Add Merge Field</button>
      </form>
        </div>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                TESTING
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout> */}
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
