const fs = require('fs');
const file = 'd:/Projects/Bunyod_Truck_front-main/src/modules/accounting/pages/Kassa/ClientAccounts.tsx';
let txt = fs.readFileSync(file, 'utf8');
txt = txt.replace(/import axios from 'axios';/g, "import axiosInstance from '@/api/axiosInstance';");
txt = txt.replace(/axios\.get\(['`]http:\/\/127\.0\.0\.1:8000\/(.*?)['`]\)/g, "axiosInstance.get('/$1')");
txt = txt.replace(/axios\.post\(['`]http:\/\/127\.0\.0\.1:8000\/(.*?)['`]/g, "axiosInstance.post('/$1'");
fs.writeFileSync(file, txt);
console.log("ClientAccounts FIXED.");
