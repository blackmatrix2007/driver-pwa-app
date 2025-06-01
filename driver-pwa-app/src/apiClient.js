import axios from "axios";

const API_URL = 'http://hlv-ws.giangdc.company/Admin/GDCService.asmx';
const KEY_PASS = 'Gdc825@';

// axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const axiosJWT = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const createSoapEnvelope = (methodName, params) => {
  let strParams = '';
  if (params) {
    Object.keys(params).forEach(param => {
      strParams += `<${param}>${params[param]}</${param}>`;
    });
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <${methodName} xmlns="http://tempuri.org/">
      ${strParams}
    </${methodName}>
  </soap:Body>
</soap:Envelope>`;
};

// Parse SOAP response
const parseSoapResponse = (responseText, methodName) => {
  const resultTag = `${methodName}Result`;
  let data = responseText.split(`<${resultTag}>`)[1];
  
  if (data) {
    data = data.split(`</${resultTag}>`)[0];
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  } else if (responseText.includes(`<${resultTag} />`)) {
    return [];
  }
  
  throw new Error('Invalid SOAP response');
};

// API client
const apiClient = {
  async post(methodName, params = {}) {
    try {
      const envelope = createSoapEnvelope(methodName, { keyPass: KEY_PASS, ...params });
      
      const response = await axiosJWT.post(API_URL, envelope, {
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'SOAPAction': `"http://tempuri.org/${methodName}"`
        },
        
      });

      const data = parseSoapResponse(response.data, methodName);
      return { data, error: false };
    } catch (error) {
      console.error('API Error:', error);
      return { 
        error: true, 
        message: error.response?.data || error.message 
      };
    }
  }
};


export const api = {
  login: (userName, password) => 
    apiClient.post('CheckLogin', { userName, passWord: password }),
    
  getShipments: (idLaiXe, tungay, denngay) => 
    apiClient.post('GetInfor_ShipmentDriver', { idLaiXe, tungay, denngay }),
    
  getShipmentDetail: (idChuyenXe) => 
    apiClient.post('GetInforDetail_TruckRoute', { idChuyenXe }),
    
  updateShipmentStatus: (idChuyenXe, trangthai) => 
    apiClient.post('UpdateStatus_TruckRoute', { idChuyenXe, trangthai }),
    
  getCustomers: () => 
    apiClient.post('GetInfor_Customer'),
    
  getDrivers: () => 
    apiClient.post('GetInfor_Driver'),
    
  saveShipment: (data) => 
    apiClient.post('SAVE_TruckRoute', data)
};