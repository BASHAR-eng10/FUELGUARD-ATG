(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/frontend/src/lib/services/api.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/services/api.js - Frontend API service
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
class ApiService {
    getToken() {
        // fetch token from local storage
        if ("TURBOPACK compile-time truthy", 1) {
            this.token = localStorage.getItem('auth_token');
        }
        return this.token;
    }
    setToken(token) {
        this.token = token;
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('auth_token', token);
        }
    }
    clearToken() {
        this.token = null;
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('auth_token');
        }
    }
    async request(endpoint) {
        let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const url = "/api".concat(endpoint);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        if (this.token) {
            config.headers.Authorization = "Bearer ".concat(this.token);
        }
        try {
            console.log("🌐 API Request: ".concat(options.method || 'GET', " ").concat(url));
            const response = await fetch(url, config);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "HTTP error! status: ".concat(response.status));
            }
            console.log("✅ API Response: ".concat(response.status, " ").concat(url));
            return data;
        } catch (error) {
            console.error("❌ API Error: ".concat(error.message));
            // Handle token expiration
            if (error.message.includes('Invalid token') || error.message.includes('Token expired')) {
                this.clearToken();
                window.location.href = '/signin';
                return;
            }
            throw error;
        }
    }
    // Authentication methods
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        });
        if (response.success) {
            this.setToken(response.data.token);
        }
        return response;
    }
    async logout() {
        try {
            await this.request('/auth/logout', {
                method: 'POST'
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally{
            this.clearToken();
        }
    }
    // Station methods
    async getAllStations() {
        return this.request('/stations');
    }
    async getStation(id) {
        return this.request("/stations/".concat(id));
    }
    // getAllStations() {
    // 	return this.request("/stationinfo/all");
    // }
    async getStationById(id) {
        return this.request("/stations/".concat(id));
    }
    // Pump/Nozzle methods
    async getStationPumps() {
        return this.request('/stations/pumps');
    }
    // tank methods
    async getStationTanks(id) {
        return this.request("/stations/".concat(id, "/tanks"));
    }
    async getAllStationTanks() {
        return this.request('/stations/tanks');
    }
    // Dashboard methods
    async getDashboardOverview() {
        return this.request('/dashboard/overview');
    }
    async getStationDashboard(id) {
        return this.request("/dashboard/station/".concat(id));
    }
    constructor(){
        this.token = null;
        if ("TURBOPACK compile-time truthy", 1) {
            this.token = localStorage.getItem('auth_token');
        }
    }
}
const __TURBOPACK__default__export__ = new ApiService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/frontend/src/app/signin/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>SignInPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function SignInPage() {
    _s();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSuccess, setIsSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [stationAccounts, setStationAccounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loadingStations, setLoadingStations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Fetch station data and build dynamic accounts
    const fetchStationAccounts = async ()=>{
        try {
            setLoadingStations(true);
            console.log('Fetching station accounts...');
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAllStations();
            const accounts = {
                // General Manager account (static)
                'manager@fuelstation.com': {
                    password: 'manager123',
                    role: 'General Manager',
                    redirect: '/dashboard/general',
                    canAccessAll: true,
                    displayName: 'General Manager - Access to all stations'
                }
            };
            // Add dynamic station accounts from API
            if (result.data && Array.isArray(result.data)) {
                console.log('Processing station data:', result.data);
                result.data.forEach((station)=>{
                    console.log('Processing station:', station.RetailStationName, station.automation_server_username);
                    if (station.automation_server_username && station.automation_server_pass) {
                        accounts[station.automation_server_username] = {
                            password: station.automation_server_pass,
                            role: station.RetailStationName,
                            redirect: "/dashboard/station?id=".concat(station.id),
                            canAccessAll: false,
                            stationId: station.id,
                            displayName: "".concat(station.RetailStationName, " Manager"),
                            location: "".concat(station.WardName, ", ").concat(station.DistrictName),
                            operator: station.OperatorName
                        };
                    }
                });
            } else {
                console.warn('Invalid API response format:', result);
            }
            console.log('Final accounts:', accounts);
            setStationAccounts(accounts);
        } catch (error) {
            console.error('Error fetching station accounts:', error);
            // Enhanced fallback to static accounts if API fails
            const fallbackAccounts = {
                'manager@fuelstation.com': {
                    password: 'manager123',
                    role: 'General Manager',
                    redirect: '/dashboard/general',
                    canAccessAll: true,
                    displayName: 'General Manager - Access to all stations'
                },
                'ungaltd@manager.com': {
                    password: 'unga1441',
                    role: 'UNGA LTD STATION',
                    redirect: '/dashboard/station?id=1',
                    canAccessAll: false,
                    stationId: 1,
                    displayName: 'UNGA LTD STATION Manager',
                    location: 'Kipunguni, Ilala MC Kipawa',
                    operator: 'LAKE OIL'
                }
            };
            setStationAccounts(fallbackAccounts);
        } finally{
            setLoadingStations(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SignInPage.useEffect": ()=>{
            fetchStationAccounts();
        }
    }["SignInPage.useEffect"], []);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            // Use correct import path
            const apiService = (await __turbopack_context__.r("[project]/frontend/src/lib/services/api.js [app-client] (ecmascript, async loader)")(__turbopack_context__.i)).default;
            const response = await apiService.login(email, password);
            if (response.success) {
                setIsSuccess(true);
                setMessage(response.message || 'Login successful! Redirecting...');
                setTimeout(()=>{
                    if (response.data.user.canAccessAll) {
                        window.location.href = '/dashboard/general';
                    } else {
                        window.location.href = "/dashboard/station?id=".concat(response.data.user.stationId);
                    }
                }, 1000);
            }
        } catch (error) {
            setMessage(error.message || 'Login failed');
            setIsSuccess(false);
        } finally{
            setIsLoading(false);
        }
    };
    const fillDemoAccount = (demoEmail, demoPassword)=>{
        setEmail(demoEmail);
        setPassword(demoPassword);
    };
    const togglePasswordVisibility = ()=>{
        setShowPassword(!showPassword);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px 24px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                position: 'relative',
                margin: '0 auto',
                width: '100%',
                maxWidth: '28rem'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'center',
                        marginBottom: '32px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                margin: '0 auto 24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/Guardlogo.png",
                                alt: "FuelGuard Logo",
                                width: 250,
                                height: 150,
                                style: {
                                    objectFit: 'contain'
                                }
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/signin/page.tsx",
                                lineNumber: 170,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                            lineNumber: 164,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontSize: '30px',
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '8px'
                            },
                            children: "Welcome Back"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                            lineNumber: 181,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                color: '#6b7280',
                                marginBottom: '8px'
                            },
                            children: "Lake Oil Group"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                            lineNumber: 189,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '14px',
                                color: '#9ca3af'
                            },
                            children: "Fuel Station Monitoring System"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                            lineNumber: 190,
                            columnNumber: 3
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                    lineNumber: 162,
                    columnNumber: 1
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: '32px',
                        background: '#ffffff',
                        padding: '32px 24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        borderRadius: '16px',
                        border: '1px solid #e5e7eb'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '24px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '8px'
                                    },
                                    children: "Email address"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                    lineNumber: 207,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'relative'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'absolute',
                                                left: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                pointerEvents: 'none'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                size: 20,
                                                color: "#9ca3af"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                lineNumber: 224,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                                            lineNumber: 217,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "email",
                                            value: email,
                                            onChange: (e)=>setEmail(e.target.value),
                                            placeholder: "Enter your email",
                                            required: true,
                                            style: {
                                                display: 'block',
                                                width: '100%',
                                                paddingLeft: '40px',
                                                paddingRight: '12px',
                                                paddingTop: '12px',
                                                paddingBottom: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '12px',
                                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                                fontSize: '16px',
                                                outline: 'none',
                                                transition: 'all 0.2s',
                                                backgroundColor: '#ffffff'
                                            },
                                            onFocus: (e)=>{
                                                e.currentTarget.style.borderColor = '#2563eb';
                                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                                            },
                                            onBlur: (e)=>{
                                                e.currentTarget.style.borderColor = '#d1d5db';
                                                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                                            lineNumber: 226,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                    lineNumber: 216,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '24px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '8px'
                                    },
                                    children: "Password"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                    lineNumber: 261,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'relative'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'absolute',
                                                left: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                pointerEvents: 'none'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                size: 20,
                                                color: "#9ca3af"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                lineNumber: 278,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                                            lineNumber: 271,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: showPassword ? "text" : "password",
                                            value: password,
                                            onChange: (e)=>setPassword(e.target.value),
                                            placeholder: "Enter your password",
                                            required: true,
                                            style: {
                                                display: 'block',
                                                width: '100%',
                                                paddingLeft: '40px',
                                                paddingRight: '40px',
                                                paddingTop: '12px',
                                                paddingBottom: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '12px',
                                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                                fontSize: '16px',
                                                outline: 'none',
                                                transition: 'all 0.2s',
                                                backgroundColor: '#ffffff'
                                            },
                                            onFocus: (e)=>{
                                                e.currentTarget.style.borderColor = '#2563eb';
                                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                                            },
                                            onBlur: (e)=>{
                                                e.currentTarget.style.borderColor = '#d1d5db';
                                                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                                            lineNumber: 280,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: togglePasswordVisibility,
                                            style: {
                                                position: 'absolute',
                                                right: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px'
                                            },
                                            children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                size: 20,
                                                color: "#9ca3af"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                lineNumber: 325,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                size: 20,
                                                color: "#9ca3af"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                lineNumber: 327,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                                            lineNumber: 310,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                    lineNumber: 270,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                            lineNumber: 260,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSubmit,
                            disabled: isLoading,
                            style: {
                                position: 'relative',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '12px 16px',
                                border: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                                borderRadius: '12px',
                                color: '#ffffff',
                                background: isLoading ? '#9ca3af' : '#2563eb',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                opacity: isLoading ? 0.7 : 1
                            },
                            onMouseEnter: (e)=>{
                                if (!isLoading) {
                                    e.currentTarget.style.background = '#1d4ed8';
                                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                                }
                            },
                            onMouseLeave: (e)=>{
                                if (!isLoading) {
                                    e.currentTarget.style.background = '#2563eb';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                }
                            },
                            children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                size: 20,
                                style: {
                                    animation: 'spin 1s linear infinite'
                                }
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/signin/page.tsx",
                                lineNumber: 369,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Sign In"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/signin/page.tsx",
                                        lineNumber: 372,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        size: 16,
                                        style: {
                                            marginLeft: '8px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/signin/page.tsx",
                                        lineNumber: 373,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                            lineNumber: 334,
                            columnNumber: 11
                        }, this),
                        message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: '24px',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid',
                                display: 'flex',
                                alignItems: 'center',
                                background: isSuccess ? '#f0fdf4' : '#fef2f2',
                                borderColor: isSuccess ? '#bbf7d0' : '#fecaca',
                                color: isSuccess ? '#166534' : '#dc2626'
                            },
                            children: [
                                isSuccess ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                    size: 20,
                                    style: {
                                        marginRight: '12px',
                                        flexShrink: 0
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                    lineNumber: 392,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                    size: 20,
                                    style: {
                                        marginRight: '12px',
                                        flexShrink: 0
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                    lineNumber: 394,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        margin: 0
                                    },
                                    children: message
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                    lineNumber: 396,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                            lineNumber: 380,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: '32px'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: 'linear-gradient(135deg, #f9fafb 0%, #dbeafe 100%)',
                                    padding: '24px',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#111827',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                size: 16,
                                                color: "#2563eb",
                                                style: {
                                                    marginRight: '8px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                lineNumber: 416,
                                                columnNumber: 17
                                            }, this),
                                            "Available Accounts ",
                                            loadingStations && '(Loading...)'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/signin/page.tsx",
                                        lineNumber: 408,
                                        columnNumber: 15
                                    }, this),
                                    loadingStations ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '20px',
                                            color: '#6b7280'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                size: 20,
                                                style: {
                                                    marginRight: '8px',
                                                    animation: 'spin 1s linear infinite'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                lineNumber: 428,
                                                columnNumber: 19
                                            }, this),
                                            "Loading station accounts..."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/signin/page.tsx",
                                        lineNumber: 421,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        },
                                        children: Object.entries(stationAccounts).map((param)=>{
                                            let [emailKey, account] = param;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>fillDemoAccount(emailKey, account.password),
                                                style: {
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    padding: '12px',
                                                    background: '#ffffff',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e7eb',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                },
                                                onMouseEnter: (e)=>{
                                                    e.currentTarget.style.borderColor = '#d1d5db';
                                                    e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                                                },
                                                onMouseLeave: (e)=>{
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    style: {
                                                                        fontSize: '14px',
                                                                        fontWeight: '500',
                                                                        color: '#111827',
                                                                        margin: 0
                                                                    },
                                                                    children: emailKey
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                                    lineNumber: 462,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    style: {
                                                                        fontSize: '12px',
                                                                        color: '#6b7280',
                                                                        margin: 0
                                                                    },
                                                                    children: account.displayName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                                    lineNumber: 470,
                                                                    columnNumber: 27
                                                                }, this),
                                                                account.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    style: {
                                                                        fontSize: '11px',
                                                                        color: '#9ca3af',
                                                                        margin: 0
                                                                    },
                                                                    children: [
                                                                        "📍 ",
                                                                        account.location
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                                    lineNumber: 478,
                                                                    columnNumber: 29
                                                                }, this),
                                                                account.operator && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    style: {
                                                                        fontSize: '11px',
                                                                        color: '#9ca3af',
                                                                        margin: 0
                                                                    },
                                                                    children: [
                                                                        "🏢 ",
                                                                        account.operator
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                                    lineNumber: 487,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    style: {
                                                                        fontSize: '10px',
                                                                        color: '#9ca3af',
                                                                        marginTop: '2px',
                                                                        margin: 0
                                                                    },
                                                                    children: [
                                                                        "Password: ",
                                                                        account.password
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                                    lineNumber: 495,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                            lineNumber: 461,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                width: '8px',
                                                                height: '8px',
                                                                borderRadius: '50%',
                                                                backgroundColor: account.canAccessAll ? '#3b82f6' : '#10b981'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                            lineNumber: 504,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                    lineNumber: 456,
                                                    columnNumber: 23
                                                }, this)
                                            }, emailKey, false, {
                                                fileName: "[project]/frontend/src/app/signin/page.tsx",
                                                lineNumber: 434,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/signin/page.tsx",
                                        lineNumber: 432,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/signin/page.tsx",
                                lineNumber: 402,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/app/signin/page.tsx",
                            lineNumber: 401,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                    lineNumber: 196,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: '32px',
                        textAlign: 'center'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: '12px',
                            color: '#9ca3af'
                        },
                        children: "Secure role-based authentication system"
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/signin/page.tsx",
                        lineNumber: 521,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/frontend/src/app/signin/page.tsx",
                    lineNumber: 520,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/src/app/signin/page.tsx",
            lineNumber: 154,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/src/app/signin/page.tsx",
        lineNumber: 145,
        columnNumber: 5
    }, this);
}
_s(SignInPage, "B0hVbIoZ10dnhksU192mqk1GaCY=");
_c = SignInPage;
var _c;
__turbopack_context__.k.register(_c, "SignInPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=frontend_src_bc05e053._.js.map