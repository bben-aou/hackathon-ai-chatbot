import { generateUUID } from '@/lib/utils';
import { DataStreamWriter, tool } from 'ai';
import { Session } from 'next-auth';
import { z } from 'zod';

interface CreateDocumentProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const propertyTypes = ['VILLA', 'FLAT'] as const;

export const getLoanSuggestions = () =>
  tool({
    description:
      'Get suggestions for loans to finance the purchase of a property. User gives the desired monthly payment, then get list of suggested loans. The proposed loans include the life insurance and multi risk insurance.',
    parameters: z.object({
      desiredMonthlyPayment: z.number(),
    }),
    execute: async (res) => {

      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json, text/plain, */*");
      myHeaders.append("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJLamxBaHpjZjFmNFppQUFhdnBacUU3WVhvTDh1N1FjV3h0QzlsTTJaRF80In0.eyJleHAiOjE3NDAwNzU1NTAsImlhdCI6MTc0MDAzOTU1MCwiYXV0aF90aW1lIjoxNzQwMDM5NTQ4LCJqdGkiOiI2NmE0ZGJiOC1jMjg2LTRmOGUtYWE4Ny1mMWZkYWFmYTVkMmUiLCJpc3MiOiJodHRwczovL2Rldi1rYy55YWtlZXkuaW8vcmVhbG1zL1lha2VleV9Mb2FuIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImVlOTM3YTJiLWI1YzktNGFkNC1iODMyLTczZTU4N2M4ZmQ5ZiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImNvY2twaXQtZnJvbnQiLCJub25jZSI6ImQ5OTUyODc5LTc0NjgtNGExMC1iNDE4LWY4MzAzZDRiODIwNyIsInNlc3Npb25fc3RhdGUiOiIwMTZiOGMzNy1kOTkyLTQzYWMtODA3Mi02NjRjNTVhM2RlZGQiLCJhY3IiOiIwIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZGV2LWNlbGx1bGUtdjItZGVtby55YWtlZXkuaW8iLCJodHRwczovL2Rldi1jZWxsdWxlLnlha2VleS5pbyIsImh0dHBzOi8vZGV2LWNlbGx1bGUtdjIueWFrZWV5LmlvIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1ZYWtlZXlfTG9hbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImNvY2twaXQtZnJvbnQiOnsicm9sZXMiOlsiUk9MRV9DRUxMVUxFIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCIsInNpZCI6IjAxNmI4YzM3LWQ5OTItNDNhYy04MDcyLTY2NGM1NWEzZGVkZCIsInByZWZlcnJlZF91c2VybmFtZSI6InN1cGVyYWRtaW5AeWFrZWV5LmNvbSIsImdpdmVuX25hbWUiOiJTdXBlciIsImZhbWlseV9uYW1lIjoiQWRtaW4iLCJlbWFpbCI6InN1cGVyYWRtaW5AeWFrZWV5LmNvbSJ9.PtRwCUjhokKUP9Iv8c_7LiPoseKQiSQt-orBDnHye1FUkT8xiWACd7xI8z2g9_66k8DSmwS15ZXe-Av5wS0XMTRWr8OqLtDsq1EYoF-jqaQqrt-koJsLa17vcpCraXTWk7s-qIeKjKJTWzTxKOPBRpGU-jkVHAnt_OxTFQxGpcl8BhQWAwcTobfNFeYuDHUELclf2gq3VYHLPFUceOP39Y-YRJ7Rwyiq7cUaukyRXXENFeX7eA2608PCYbx3iwrvGNZYsTealcM_U1wPkKsX7DH2M-M_PYh4Zrzn78oSIcendqBFpJf3KWgv1EZpaQhWbFsP0bMSUdKhiREEaHbjsg");
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "desiredMonthlyPayment": res.desiredMonthlyPayment,
        "birthdate": "1999-02-01"
      });


  const response = await fetch("https://dev-cockpit-v2.yakeey.io/api/v2/simulator/borrowing-capacity-list/desired-monthly-payment", {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));


      return {
        id: generateUUID(),
        loanSuggestions: [...response.data],
      };
    },
  });
