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
"[project]/frontend/src/app/dashboard/general/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>GeneralDashboard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
//  const apiService = (await import('../../services/api')).default
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/api.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    headerContent: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '80px' // 64px'den 80px'e çıkar
    },
    logoSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    logoTitle: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#111827',
        margin: 0
    },
    logoSubtitle: {
        fontSize: '16px',
        color: '#6b7280',
        margin: 0
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    iconButton: {
        position: 'relative',
        padding: '8px',
        color: '#6b7280',
        background: 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    badge: {
        position: 'absolute',
        top: '-2px',
        right: '-2px',
        width: '16px',
        height: '16px',
        backgroundColor: '#dc2626',
        color: 'white',
        fontSize: '10px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    signOutButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        color: '#6b7280',
        background: 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '14px'
    },
    main: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px'
    },
    welcomeSection: {
        marginBottom: '32px'
    },
    welcomeTitle: {
        fontSize: '30px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '8px'
    },
    welcomeText: {
        color: '#6b7280'
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
    },
    metricCard: {
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '24px',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer'
    },
    metricHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
    },
    metricIcon: {
        padding: '8px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    statusBadge: {
        fontSize: '12px',
        fontWeight: '500',
        padding: '4px 8px',
        borderRadius: '9999px'
    },
    metricValue: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '4px'
    },
    metricLabel: {
        color: '#6b7280',
        fontSize: '14px',
        marginBottom: '12px'
    },
    metricFooter: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        color: '#6b7280'
    },
    overviewCard: {
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '24px',
        maxWidth: '600px',
        margin: '0 auto'
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '24px'
    },
    alertsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    alertItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        transition: 'background-color 0.2s',
        cursor: 'pointer'
    },
    alertInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    alertDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%'
    },
    alertDetails: {
        flex: 1
    },
    alertType: {
        fontWeight: '500',
        color: '#111827',
        margin: 0
    },
    alertStation: {
        fontSize: '14px',
        color: '#6b7280',
        margin: 0
    },
    alertTime: {
        fontSize: '12px',
        color: '#6b7280'
    },
    viewAllButton: {
        width: '100%',
        marginTop: '16px',
        padding: '8px 16px',
        color: '#2563eb',
        background: 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '14px',
        fontWeight: '500'
    },
    successMessage: {
        background: 'linear-gradient(135deg, #dcfce7 0%, #dbeafe 100%)',
        border: '1px solid #16a34a',
        borderRadius: '16px',
        padding: '24px'
    },
    messageContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    messageIcon: {
        padding: '8px',
        backgroundColor: '#dcfce7',
        borderRadius: '50%'
    },
    messageTitle: {
        fontWeight: '600',
        color: '#166534',
        marginBottom: '4px'
    },
    messageText: {
        color: '#15803d'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e5e7eb'
    },
    modalHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
    },
    modalTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#111827',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        transition: 'background-color 0.2s',
        color: '#6b7280'
    },
    stationsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    stationCard: {
        background: '#f9fafb',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    stationInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: 1
    },
    stationIcon: {
        padding: '12px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    stationDetails: {
        flex: 1
    },
    stationName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#111827',
        margin: 0,
        marginBottom: '4px'
    },
    stationLocation: {
        fontSize: '14px',
        color: '#6b7280',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    stationMetrics: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    stationMetric: {
        textAlign: 'right'
    },
    stationMetricValue: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#111827',
        margin: 0
    },
    stationMetricLabel: {
        fontSize: '12px',
        color: '#6b7280',
        margin: 0
    },
    statusIndicator: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        marginLeft: '12px'
    }
};
function GeneralDashboard() {
    _s();
    const [showStationsModal, setShowStationsModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [stations, setStations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch stations data from API
    const fetchStations = async ()=>{
        try {
            setLoading(true);
            setError(null);
            // to make this request Authorization with token is required
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getToken();
            console.log(token);
            // fix CORS error here
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAllStations();
            console.log(result.data);
            if (result.data && Array.isArray(result.data)) {
                // Transform API data to match our component structure
                const transformedStations = result.data.map((station, index)=>({
                        id: station.id,
                        name: station.RetailStationName,
                        location: "".concat(station.WardName, ", ").concat(station.DistrictName),
                        region: station.RegionName,
                        zone: station.Zone,
                        operatorName: station.OperatorName,
                        contactEmail: station.ContactPersonEmailAddress,
                        contactPhone: station.ContactPersonPhone,
                        ewuraLicense: station.EWURALicenseNo,
                        tanks: station.TotalNoTanks,
                        username: station.automation_server_username,
                        password: station.automation_server_pass,
                        // Mock data for demo - in production these would come from separate endpoints
                        status: index === 0 ? 'excellent' : index === 1 ? 'good' : 'fair',
                        efficiency: index === 0 ? 92 : index === 1 ? 88 : 75,
                        revenue: index === 0 ? '$4,280' : index === 1 ? '$5,120' : '$3,050',
                        nozzles: index === 0 ? 6 : index === 1 ? 8 : 6,
                        alerts: index === 0 ? 0 : index === 1 ? 1 : 2,
                        color: index === 0 ? '#22c55e' : index === 1 ? '#3b82f6' : '#eab308'
                    }));
                setStations(transformedStations);
            } else {
                throw new Error('Invalid data format received from API');
            }
        } catch (err) {
            console.error('Error fetching stations:', err);
            setError(err.message);
            // Fallback to mock data
            setStations([
                {
                    id: 1,
                    name: 'Main Street Station',
                    location: '123 Main Street, Downtown',
                    status: 'excellent',
                    efficiency: 92,
                    revenue: '$4,280',
                    tanks: 2,
                    nozzles: 6,
                    alerts: 0,
                    color: '#22c55e'
                }
            ]);
        } finally{
            setLoading(false);
        }
    };
    // Fetch data on component mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GeneralDashboard.useEffect": ()=>{
            fetchStations();
        }
    }["GeneralDashboard.useEffect"], []);
    const alerts = [
        {
            type: 'Water Detection',
            station: 'Main Street',
            severity: 'high',
            time: '2 hours ago',
            color: '#dc2626'
        },
        {
            type: 'Cash Discrepancy',
            station: 'Highway Junction',
            severity: 'medium',
            time: '4 hours ago',
            color: '#eab308'
        },
        {
            type: 'Tank Level Low',
            station: 'Airport Road',
            severity: 'low',
            time: '6 hours ago',
            color: '#3b82f6'
        }
    ];
    const handleSignOut = ()=>{
        window.location.href = '/signin';
    };
    const handleStationClick = (stationId)=>{
        window.location.href = "/dashboard/station?id=".concat(stationId);
    };
    const openStationsModal = ()=>{
        setShowStationsModal(true);
    };
    const closeStationsModal = ()=>{
        setShowStationsModal(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: styles.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                style: styles.header,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: styles.headerContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.logoSection,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/logo.png",
                                    alt: "Lake Oil Group Logo",
                                    style: {
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'contain'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                    lineNumber: 495,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            style: styles.logoTitle,
                                            children: "Lake Oil Group"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                            lineNumber: 505,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: styles.logoSubtitle,
                                            children: "General Manager"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                            lineNumber: 506,
                                            columnNumber: 5
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                    lineNumber: 504,
                                    columnNumber: 3
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                            lineNumber: 494,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.headerActions,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    style: styles.iconButton,
                                    onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#f3f4f6',
                                    onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                            lineNumber: 516,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: styles.badge,
                                            children: "2"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                            lineNumber: 517,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                    lineNumber: 511,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    style: styles.iconButton,
                                    onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#f3f4f6',
                                    onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                        lineNumber: 524,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                    lineNumber: 519,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSignOut,
                                    style: styles.signOutButton,
                                    onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#f3f4f6',
                                    onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                            lineNumber: 532,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Sign Out"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                            lineNumber: 533,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                    lineNumber: 526,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                            lineNumber: 510,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                    lineNumber: 493,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                lineNumber: 492,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: styles.main,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.welcomeSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: styles.welcomeTitle
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                lineNumber: 543,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    ...styles.welcomeTitle,
                                    fontSize: '50px'
                                },
                                children: " FuelGuard"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                lineNumber: 544,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                        lineNumber: 542,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.metricsGrid,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.metricCard,
                                onClick: openStationsModal,
                                onMouseEnter: (e)=>e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                onMouseLeave: (e)=>e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.metricHeader,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...styles.metricIcon,
                                                    backgroundColor: '#dbeafe'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                    size: 24,
                                                    color: "#2563eb"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 557,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                lineNumber: 556,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    ...styles.statusBadge,
                                                    color: '#166534',
                                                    backgroundColor: '#dcfce7'
                                                },
                                                children: "Active"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                lineNumber: 559,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                        lineNumber: 555,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: styles.metricValue,
                                        children: loading ? '-' : stations.length
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                        lineNumber: 561,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: styles.metricLabel,
                                        children: "Total Stations"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                        lineNumber: 562,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.metricFooter,
                                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    size: 12,
                                                    style: {
                                                        marginRight: '4px',
                                                        animation: 'spin 1s linear infinite'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 566,
                                                    columnNumber: 19
                                                }, this),
                                                "Loading stations..."
                                            ]
                                        }, void 0, true) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                    size: 12,
                                                    style: {
                                                        marginRight: '4px'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 571,
                                                    columnNumber: 19
                                                }, this),
                                                "Click to retry"
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                    size: 12,
                                                    style: {
                                                        marginRight: '4px'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 576,
                                                    columnNumber: 19
                                                }, this),
                                                "Click to view all stations"
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                        lineNumber: 563,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                lineNumber: 549,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.metricCard,
                                onMouseEnter: (e)=>e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                onMouseLeave: (e)=>e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.metricHeader,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...styles.metricIcon,
                                                    backgroundColor: '#fee2e2'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                    size: 24,
                                                    color: "#dc2626"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 590,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                lineNumber: 589,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    ...styles.statusBadge,
                                                    color: '#dc2626',
                                                    backgroundColor: '#fee2e2'
                                                },
                                                children: "Urgent"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                lineNumber: 592,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                        lineNumber: 588,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: styles.metricValue,
                                        children: "2"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                        lineNumber: 594,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: styles.metricLabel,
                                        children: "Active Alerts"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                        lineNumber: 595,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.metricFooter,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                size: 12,
                                                color: "#dc2626",
                                                style: {
                                                    marginRight: '4px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                lineNumber: 597,
                                                columnNumber: 15
                                            }, this),
                                            "Requires attention"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                        lineNumber: 596,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                lineNumber: 583,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                        lineNumber: 548,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.overviewCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: styles.cardTitle,
                                children: "Recent Alerts"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                lineNumber: 605,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.alertsList,
                                children: alerts.map((alert, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.alertItem,
                                        onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#f9fafb',
                                        onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.alertInfo,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            ...styles.alertDot,
                                                            backgroundColor: alert.color
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                        lineNumber: 615,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.alertDetails,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.alertType,
                                                                children: alert.type
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                                lineNumber: 617,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.alertStation,
                                                                children: alert.station
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                                lineNumber: 618,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                        lineNumber: 616,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                lineNumber: 614,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: styles.alertTime,
                                                children: alert.time
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                lineNumber: 621,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, index, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                        lineNumber: 608,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                lineNumber: 606,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                style: styles.viewAllButton,
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.backgroundColor = '#dbeafe';
                                    e.currentTarget.style.color = '#1d4ed8';
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#2563eb';
                                },
                                children: "View All Alerts"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                lineNumber: 625,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                        lineNumber: 604,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                lineNumber: 540,
                columnNumber: 7
            }, this),
            showStationsModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: styles.modalOverlay,
                onClick: closeStationsModal,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: styles.modalContent,
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.modalHeader,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: styles.modalTitle,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                            size: 20,
                                            color: "#2563eb"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                            lineNumber: 650,
                                            columnNumber: 17
                                        }, this),
                                        "All Stations ",
                                        loading && '(Loading...)'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                    lineNumber: 649,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: '8px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: {
                                                ...styles.closeButton,
                                                padding: '6px'
                                            },
                                            onClick: fetchStations,
                                            onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#f3f4f6',
                                            onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
                                            title: "Refresh stations",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                lineNumber: 661,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                            lineNumber: 654,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: styles.closeButton,
                                            onClick: closeStationsModal,
                                            onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#f3f4f6',
                                            onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                lineNumber: 669,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                            lineNumber: 663,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                    lineNumber: 653,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                            lineNumber: 648,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '16px',
                                padding: '12px',
                                backgroundColor: '#fef2f2',
                                borderRadius: '8px',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                    lineNumber: 687,
                                    columnNumber: 17
                                }, this),
                                "Error loading stations: ",
                                error
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                            lineNumber: 675,
                            columnNumber: 15
                        }, this),
                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '40px',
                                color: '#6b7280'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    size: 24,
                                    style: {
                                        marginRight: '8px',
                                        animation: 'spin 1s linear infinite'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                    lineNumber: 700,
                                    columnNumber: 17
                                }, this),
                                "Loading stations from server..."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                            lineNumber: 693,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.stationsList,
                            children: stations.map((station)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.stationCard,
                                    onClick: ()=>handleStationClick(station.id),
                                    onMouseEnter: (e)=>{
                                        e.currentTarget.style.backgroundColor = '#ffffff';
                                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                        e.currentTarget.style.borderColor = '#d1d5db';
                                    },
                                    onMouseLeave: (e)=>{
                                        e.currentTarget.style.backgroundColor = '#f9fafb';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: styles.stationInfo,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        ...styles.stationIcon,
                                                        backgroundColor: "".concat(station.color, "20")
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                        size: 20,
                                                        color: station.color
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                        lineNumber: 723,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 722,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: styles.stationDetails,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            style: styles.stationName,
                                                            children: station.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 726,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: styles.stationLocation,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                    size: 12
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                                    lineNumber: 728,
                                                                    columnNumber: 27
                                                                }, this),
                                                                station.location
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 727,
                                                            columnNumber: 25
                                                        }, this),
                                                        station.operatorName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                ...styles.stationLocation,
                                                                color: '#9ca3af',
                                                                fontSize: '11px'
                                                            },
                                                            children: [
                                                                "Operator: ",
                                                                station.operatorName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 732,
                                                            columnNumber: 27
                                                        }, this),
                                                        station.ewuraLicense && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                ...styles.stationLocation,
                                                                color: '#9ca3af',
                                                                fontSize: '11px'
                                                            },
                                                            children: [
                                                                "License: ",
                                                                station.ewuraLicense
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 737,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 725,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                            lineNumber: 721,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: styles.stationMetrics,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: styles.stationMetric,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: styles.stationMetricValue,
                                                            children: [
                                                                station.efficiency,
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 746,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: styles.stationMetricLabel,
                                                            children: "Efficiency"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 747,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 745,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: styles.stationMetric,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: styles.stationMetricValue,
                                                            children: station.revenue
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 750,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: styles.stationMetricLabel,
                                                            children: "Today"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 751,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 749,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: styles.stationMetric,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: styles.stationMetricValue,
                                                            children: station.tanks
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 754,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: styles.stationMetricLabel,
                                                            children: "Tanks"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 755,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 753,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: styles.stationMetric,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: styles.stationMetricValue,
                                                            children: station.nozzles
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 758,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: styles.stationMetricLabel,
                                                            children: "Nozzles"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 759,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 757,
                                                    columnNumber: 23
                                                }, this),
                                                station.alerts > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: styles.stationMetric,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                ...styles.stationMetricValue,
                                                                color: '#dc2626'
                                                            },
                                                            children: station.alerts
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 763,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: styles.stationMetricLabel,
                                                            children: "Alerts"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                            lineNumber: 764,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 762,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        ...styles.statusIndicator,
                                                        backgroundColor: station.color
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                                    lineNumber: 767,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                            lineNumber: 744,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, station.id, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                    lineNumber: 706,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                            lineNumber: 704,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: '24px',
                                padding: '16px',
                                backgroundColor: '#f9fafb',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    margin: 0,
                                    fontSize: '14px',
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                        lineNumber: 789,
                                        columnNumber: 17
                                    }, this),
                                    "Click on any station to access its detailed dashboard and controls."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                                lineNumber: 781,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                            lineNumber: 774,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                    lineNumber: 647,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
                lineNumber: 646,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/app/dashboard/general/page.tsx",
        lineNumber: 490,
        columnNumber: 5
    }, this);
}
_s(GeneralDashboard, "jLDQYAOE6itLgVy4WlvVcqi6OGw=");
_c = GeneralDashboard;
var _c;
__turbopack_context__.k.register(_c, "GeneralDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=frontend_src_45b1e72b._.js.map