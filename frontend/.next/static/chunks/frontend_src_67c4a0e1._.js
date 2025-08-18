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
"[project]/frontend/src/app/dashboard/station/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>StationDashboard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gauge.js [app-client] (ecmascript) <export default as Gauge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplets.js [app-client] (ecmascript) <export default as Droplets>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-client] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
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
        height: '64px'
    },
    logoSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    logoTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#111827',
        margin: 0
    },
    logoSubtitle: {
        fontSize: '14px',
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
        backgroundColor: '#eab308',
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
    tankGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
    },
    tankCard: {
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '24px'
    },
    tankHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
    },
    tankInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    tankIcon: {
        padding: '8px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tankDetails: {
        flex: 1
    },
    tankName: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827',
        margin: 0
    },
    tankCapacity: {
        fontSize: '14px',
        color: '#6b7280',
        margin: 0
    },
    statusBadge: {
        fontSize: '12px',
        fontWeight: '500',
        padding: '4px 8px',
        borderRadius: '9999px'
    },
    levelSection: {
        marginBottom: '16px'
    },
    levelHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px'
    },
    levelLabel: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151'
    },
    levelPercentage: {
        fontSize: '14px',
        fontWeight: 'bold'
    },
    progressBar: {
        width: '100%',
        height: '12px',
        backgroundColor: '#e5e7eb',
        borderRadius: '9999px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        borderRadius: '9999px',
        transition: 'width 0.3s ease'
    },
    levelDetails: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '8px',
        fontSize: '12px',
        color: '#6b7280'
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginTop: '16px'
    },
    metricBox: {
        background: '#f9fafb',
        borderRadius: '8px',
        padding: '12px'
    },
    metricHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '4px'
    },
    metricLabel: {
        fontSize: '12px',
        color: '#6b7280'
    },
    metricValue: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827',
        margin: 0
    },
    quantitySection: {
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '16px',
        marginTop: '16px',
        border: '1px solid #e2e8f0'
    },
    quantityTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    quantityGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px'
    },
    quantityItem: {
        background: '#ffffff',
        borderRadius: '8px',
        padding: '12px',
        border: '1px solid #e2e8f0'
    },
    quantityLabel: {
        fontSize: '11px',
        color: '#64748b',
        marginBottom: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    quantityValue: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1e293b',
        margin: 0
    },
    editButton: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        transition: 'background-color 0.2s'
    },
    inputField: {
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    nozzleSection: {
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '24px',
        marginBottom: '32px'
    },
    nozzleTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    nozzleGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
    },
    nozzleCard: {
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #e2e8f0'
    },
    nozzleHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    },
    nozzleName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1e293b'
    },
    nozzleStatus: {
        fontSize: '10px',
        fontWeight: '500',
        padding: '2px 6px',
        borderRadius: '6px'
    },
    nozzleMetrics: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px'
    },
    nozzleMetric: {
        textAlign: 'center'
    },
    nozzleMetricValue: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#1e293b',
        margin: 0
    },
    nozzleMetricLabel: {
        fontSize: '11px',
        color: '#64748b',
        marginTop: '2px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
    },
    statCard: {
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '24px',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer'
    },
    statHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
    },
    statIcon: {
        padding: '8px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    statValue: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '4px'
    },
    statLabel: {
        color: '#6b7280',
        fontSize: '14px',
        marginBottom: '12px'
    },
    statFooter: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        color: '#6b7280'
    },
    actionsCard: {
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '24px',
        marginBottom: '32px'
    },
    actionsTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '24px'
    },
    actionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '16px'
    },
    actionButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '14px',
        fontWeight: '500'
    },
    successMessage: {
        background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)',
        border: '1px solid #3b82f6',
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
        backgroundColor: '#dbeafe',
        borderRadius: '50%'
    },
    messageTitle: {
        fontWeight: '600',
        color: '#1e40af',
        marginBottom: '4px'
    },
    messageText: {
        color: '#1e3a8a'
    },
    loadingState: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#6b7280',
        fontSize: '14px'
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
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
    },
    modalTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#111827',
        margin: 0
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        color: '#6b7280'
    },
    checklistContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    checklistItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s'
    },
    checklistItemChecked: {
        backgroundColor: '#dcfce7',
        borderColor: '#16a34a'
    },
    checkbox: {
        width: '20px',
        height: '20px',
        borderRadius: '4px',
        border: '2px solid #d1d5db',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    checkboxChecked: {
        backgroundColor: '#16a34a',
        borderColor: '#16a34a',
        color: '#ffffff'
    },
    checklistLabel: {
        fontSize: '16px',
        color: '#374151',
        fontWeight: '500',
        flex: 1
    },
    checklistLabelChecked: {
        color: '#166534'
    },
    modalFooter: {
        marginTop: '24px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
    },
    modalButton: {
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s'
    },
    saveButton: {
        backgroundColor: '#16a34a',
        color: '#ffffff'
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
        color: '#374151'
    },
    salesRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '12px'
    },
    salesRowTotal: {
        backgroundColor: '#dbeafe',
        borderColor: '#3b82f6',
        fontWeight: '600'
    },
    salesRowETotals: {
        backgroundColor: '#dcfce7',
        borderColor: '#16a34a',
        fontWeight: '600'
    },
    salesLabel: {
        fontSize: '16px',
        color: '#374151',
        fontWeight: '500'
    },
    salesValue: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827'
    },
    salesValueHighlight: {
        color: '#16a34a',
        fontSize: '20px'
    },
    salesDetails: {
        fontSize: '12px',
        color: '#6b7280',
        marginTop: '4px'
    },
    salesIcon: {
        marginRight: '8px'
    },
    textarea: {
        width: '100%',
        minHeight: '120px',
        padding: '12px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'inherit',
        resize: 'vertical',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    selectField: {
        width: '100%',
        padding: '12px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    formGroup: {
        marginBottom: '16px'
    },
    formLabel: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '8px'
    },
    urgentCategory: {
        backgroundColor: '#fee2e2',
        borderColor: '#dc2626'
    },
    characterCount: {
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'right',
        marginTop: '4px'
    },
    sendingButton: {
        backgroundColor: '#9ca3af',
        cursor: 'not-allowed'
    }
};
function StationDashboard() {
    _s();
    const [stationData, setStationData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [nozzleData, setNozzleData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tankData, setTankData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [pumpsLoading, setPumpsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [tanksLoading, setTanksLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pumpsError, setPumpsError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tanksError, setTanksError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showChecklistModal, setShowChecklistModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSalesModal, setShowSalesModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showIssueModal, setShowIssueModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [issueMessage, setIssueMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [issueCategory, setIssueCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('general');
    const [issueSending, setIssueSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [checklistItems, setChecklistItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        calibration: false,
        pipelineLeak: false,
        tankLeak: false,
        safetyEquipment: false
    });
    const [managerCash, setManagerCash] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Sales data - normally would come from API
    const [salesData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        unleaded: {
            liters: 4220,
            pricePerLiter: 1.45,
            cash: 4220 * 1.45
        },
        diesel: {
            liters: 5800,
            pricePerLiter: 1.52,
            cash: 5800 * 1.52
        },
        eTotalCash: 14629
    });
    // Get station ID from URL
    const getStationId = ()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('id') || '1';
        }
        //TURBOPACK unreachable
        ;
    };
    // Fetch pump data from API
    const fetchPumpData = async ()=>{
        try {
            setPumpsLoading(true);
            setPumpsError(null);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getStationPumps();
            if (response.data && Array.isArray(response.data)) {
                setNozzleData(response.data);
            } else {
                throw new Error('Invalid API response structure');
            }
        } catch (err) {
            console.error('Error fetching pump data:', err);
            setPumpsError(err.message);
        } finally{
            setPumpsLoading(false);
        }
    };
    // Fetch tank data from API
    const fetchTankData = async ()=>{
        try {
            setTanksLoading(true);
            setTanksError(null);
            const stationId = getStationId();
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getStationTanks(stationId);
            if (response.data && Array.isArray(response.data)) {
                setTankData(response.data);
                console.log(response.data);
            } else {
                throw new Error('Invalid API response structure');
            }
        } catch (err) {
            console.error('Error fetching tank data:', err);
            setTanksError(err.message);
        } finally{
            setTanksLoading(false);
        }
    };
    // Fetch station data from API
    const fetchStationData = async ()=>{
        try {
            setLoading(true);
            setError(null);
            const stationId = getStationId();
            console.log('Fetching station data for ID:', stationId);
            // Fetch station info
            const station = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getStation(stationId);
            console.log('Station API Response:', station);
            if (station && station.data) {
                setStationData({
                    id: station.data.id,
                    name: station.data.RetailStationName,
                    location: "".concat(station.data.WardName, ", ").concat(station.data.DistrictName),
                    region: station.data.RegionName,
                    zone: station.data.Zone,
                    operatorName: station.data.OperatorName,
                    contactEmail: station.data.ContactPersonEmailAddress,
                    contactPhone: station.data.ContactPersonPhone,
                    ewuraLicense: station.data.EWURALicenseNo,
                    tanks: station.data.TotalNoTanks,
                    username: station.data.automation_server_username,
                    password: station.data.automation_server_pass
                });
            } else {
                console.error('Invalid API response structure:', station);
                throw new Error("Station with ID ".concat(stationId, " not found. Available stations: ").concat(station.id));
            }
        } catch (err) {
            console.error('Error fetching station data:', err);
            setError(err.message);
            // Enhanced fallback data
            const stationId = getStationId();
            setStationData({
                id: parseInt(stationId),
                name: "Station ".concat(stationId, " (Fallback)"),
                location: 'Location unavailable',
                operatorName: 'LAKE OIL',
                tanks: 2,
                ewuraLicense: 'License unavailable'
            });
        } finally{
            setLoading(false);
        }
    };
    const refreshAllData = async ()=>{
        await Promise.all([
            fetchStationData(),
            fetchPumpData(),
            fetchTankData()
        ]);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StationDashboard.useEffect": ()=>{
            refreshAllData();
        }
    }["StationDashboard.useEffect"], []);
    const handleSignOut = ()=>{
        window.location.href = '/signin';
    };
    const handleChecklistItemChange = (item)=>{
        setChecklistItems((prev)=>({
                ...prev,
                [item]: !prev[item]
            }));
    };
    const handleSaveChecklist = ()=>{
        console.log('Checklist saved:', checklistItems);
        // Here you would typically save to your API
        setShowChecklistModal(false);
    };
    const handleCloseModal = ()=>{
        setShowChecklistModal(false);
    };
    const handleCloseSalesModal = ()=>{
        setShowSalesModal(false);
    };
    const handleSaveSales = ()=>{
        console.log('Sales data recorded:', salesData);
        // Here you would typically save to your API
        setShowSalesModal(false);
    };
    const handleCloseIssueModal = ()=>{
        setShowIssueModal(false);
        setIssueMessage('');
        setIssueCategory('general');
    };
    const handleSendIssueReport = async ()=>{
        if (!issueMessage.trim()) {
            alert('Please enter an issue description before sending.');
            return;
        }
        setIssueSending(true);
        try {
            // Simulate API call to send SMS
            const issueData = {
                stationId: stationData === null || stationData === void 0 ? void 0 : stationData.id,
                stationName: stationData === null || stationData === void 0 ? void 0 : stationData.name,
                category: issueCategory,
                message: issueMessage,
                timestamp: new Date().toISOString(),
                managerName: 'Station Manager',
                urgency: issueCategory === 'emergency' ? 'HIGH' : 'NORMAL'
            };
            console.log('Sending issue report:', issueData);
            // Here you would call your SMS API
            // await apiService.sendIssueReport(issueData)
            // Simulate delay
            await new Promise((resolve)=>setTimeout(resolve, 2000));
            alert('Issue report sent successfully!\n\nSMS sent to General Manager:\n"STATION ALERT: '.concat((stationData === null || stationData === void 0 ? void 0 : stationData.name) || 'Station', " - ").concat(issueCategory.toUpperCase(), "\n").concat(issueMessage, "\nReported by: Station Manager\nTime: ").concat(new Date().toLocaleString(), '"'));
            handleCloseIssueModal();
        } catch (error) {
            console.error('Error sending issue report:', error);
            alert('Failed to send issue report. Please try again.');
        } finally{
            setIssueSending(false);
        }
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                    size: 32,
                                    color: "#2563eb"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 919,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            style: styles.logoTitle,
                                            children: loading ? 'Loading...' : (stationData === null || stationData === void 0 ? void 0 : stationData.name) || 'Station Dashboard'
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 921,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: styles.logoSubtitle,
                                            children: "Station Manager"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 924,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 920,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                            lineNumber: 918,
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
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 934,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: styles.badge,
                                            children: "1"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 935,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 929,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    style: styles.iconButton,
                                    onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#f3f4f6',
                                    onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 942,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 937,
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
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 950,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Sign Out"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 951,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 944,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                            lineNumber: 928,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                    lineNumber: 917,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                lineNumber: 916,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: styles.main,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.welcomeSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: styles.welcomeTitle,
                                children: "Station Overview "
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 961,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: styles.welcomeText,
                                children: loading ? 'Loading station information...' : error ? "Error: ".concat(error) : "Monitor ".concat((stationData === null || stationData === void 0 ? void 0 : stationData.name) || 'your station', "'s operations and performance in real-time.")
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 962,
                                columnNumber: 11
                            }, this),
                            stationData && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: '16px',
                                    padding: '12px',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '12px',
                                            fontSize: '14px',
                                            color: '#64748b'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "📍 ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Location:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 982,
                                                        columnNumber: 25
                                                    }, this),
                                                    " ",
                                                    stationData.location
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 982,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "🏢 ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Operator:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 983,
                                                        columnNumber: 25
                                                    }, this),
                                                    " ",
                                                    stationData.operatorName
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 983,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "📋 ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "License:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 984,
                                                        columnNumber: 25
                                                    }, this),
                                                    " ",
                                                    stationData.ewuraLicense
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 984,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "🛢️ ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Tanks:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 985,
                                                        columnNumber: 26
                                                    }, this),
                                                    " ",
                                                    tanksLoading ? 'Loading...' : tankData.length || stationData.tanks
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 985,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "⛽ ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Pumps/Nozzles:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 986,
                                                        columnNumber: 24
                                                    }, this),
                                                    " ",
                                                    pumpsLoading ? 'Loading...' : nozzleData.length
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 986,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 975,
                                        columnNumber: 15
                                    }, this),
                                    (pumpsError || tanksError) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: '8px',
                                            padding: '8px',
                                            backgroundColor: '#fee2e2',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            color: '#dc2626'
                                        },
                                        children: [
                                            pumpsError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "⚠️ Pump data error: ",
                                                    pumpsError
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 998,
                                                columnNumber: 34
                                            }, this),
                                            tanksError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "⚠️ Tank data error: ",
                                                    tanksError
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 999,
                                                columnNumber: 34
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: '4px',
                                                    fontSize: '11px'
                                                },
                                                children: "Using fallback data where available"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1000,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 990,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: refreshAllData,
                                        style: {
                                            marginTop: '8px',
                                            padding: '6px 12px',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1020,
                                                columnNumber: 17
                                            }, this),
                                            "Refresh All Data"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1004,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 968,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                        lineNumber: 960,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '24px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#111827',
                                            margin: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"], {
                                                size: 20,
                                                color: "#2563eb"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1044,
                                                columnNumber: 15
                                            }, this),
                                            "Tank Monitoring",
                                            tanksLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.loadingState,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        size: 16,
                                                        className: "animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1048,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Loading tank data..."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1047,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1035,
                                        columnNumber: 13
                                    }, this),
                                    tanksError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '8px 12px',
                                            backgroundColor: '#fee2e2',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            color: '#dc2626',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1064,
                                                columnNumber: 17
                                            }, this),
                                            "Tank data error: ",
                                            tanksError
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1054,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1029,
                                columnNumber: 11
                            }, this),
                            tanksLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.tankGrid,
                                children: [
                                    1,
                                    2
                                ].map((index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            ...styles.tankCard,
                                            opacity: 0.6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.tankHeader,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.tankInfo,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    ...styles.tankIcon,
                                                                    backgroundColor: '#f3f4f6'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                    size: 24,
                                                                    color: "#9ca3af",
                                                                    className: "animate-spin"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                    lineNumber: 1080,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1079,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.tankDetails,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        style: {
                                                                            ...styles.tankName,
                                                                            color: '#9ca3af'
                                                                        },
                                                                        children: [
                                                                            "Loading Tank ",
                                                                            index,
                                                                            "..."
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1083,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            ...styles.tankCapacity,
                                                                            color: '#9ca3af'
                                                                        },
                                                                        children: "Fetching capacity..."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1084,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1082,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1078,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            ...styles.statusBadge,
                                                            color: '#9ca3af',
                                                            backgroundColor: '#f3f4f6'
                                                        },
                                                        children: "Loading"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1087,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1077,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.levelSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.levelHeader,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: styles.levelLabel,
                                                                children: "Current Level"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1092,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    ...styles.levelPercentage,
                                                                    color: '#9ca3af'
                                                                },
                                                                children: "---%"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1093,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1091,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.progressBar,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                ...styles.progressFill,
                                                                width: '50%',
                                                                background: 'linear-gradient(90deg, #e5e7eb 0%, #d1d5db 100%)',
                                                                animation: 'pulse 2s infinite'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 1096,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1095,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.levelDetails,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Loading..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1104,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontWeight: '500',
                                                                    color: '#9ca3af'
                                                                },
                                                                children: "--- liters"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1105,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "---"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1106,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1103,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1090,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.metricsGrid,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.metricBox,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.metricHeader,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"], {
                                                                        size: 16,
                                                                        color: "#d1d5db"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1113,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: styles.metricLabel,
                                                                        children: "Temperature"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1114,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1112,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.metricValue,
                                                                    color: '#9ca3af'
                                                                },
                                                                children: "---°C"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1116,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1111,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.metricBox,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.metricHeader,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"], {
                                                                        size: 16,
                                                                        color: "#d1d5db"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1120,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: styles.metricLabel,
                                                                        children: "Water Level"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1121,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1119,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.metricValue,
                                                                    color: '#9ca3af'
                                                                },
                                                                children: "--- mm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1123,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1118,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1110,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, index, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1073,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1071,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.tankGrid,
                                children: tankData.length > 0 ? tankData.map((tank)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.tankCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.tankHeader,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.tankInfo,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    ...styles.tankIcon,
                                                                    backgroundColor: '#dbeafe'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"], {
                                                                    size: 24,
                                                                    color: "#2563eb"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                    lineNumber: 1137,
                                                                    columnNumber: 19
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1136,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.tankDetails,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        style: styles.tankName,
                                                                        children: [
                                                                            "Tank ",
                                                                            tank.tank_id,
                                                                            " - ",
                                                                            tank.tank_name
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1140,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: styles.tankCapacity,
                                                                        children: [
                                                                            tank.tank_capacity,
                                                                            " L capacity"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1141,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1139,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1135,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            ...styles.statusBadge,
                                                            color: '#166534',
                                                            backgroundColor: '#dcfce7'
                                                        },
                                                        children: tank.product_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1144,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1134,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.levelSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.levelHeader,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: styles.levelLabel,
                                                                children: "Current Level"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1149,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    ...styles.levelPercentage,
                                                                    color: '#2563eb'
                                                                },
                                                                children: [
                                                                    (tank.fuel_volume / tank.tank_capacity * 100).toFixed(2),
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1150,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1148,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.progressBar,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                ...styles.progressFill,
                                                                width: "".concat((tank.fuel_volume / tank.tank_capacity * 100).toFixed(2), "%"),
                                                                background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 1153,
                                                            columnNumber: 17
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1152,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.levelDetails,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "0 L"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1160,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontWeight: '500',
                                                                    color: '#374151'
                                                                },
                                                                children: [
                                                                    tank.fuel_volume,
                                                                    " liters"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1161,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    tank.tank_capacity,
                                                                    " L"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1162,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1159,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1147,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.metricsGrid,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.metricBox,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.metricHeader,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"], {
                                                                        size: 16,
                                                                        color: "#f59e0b"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1169,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: styles.metricLabel,
                                                                        children: "Temperature"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1170,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1168,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.metricValue,
                                                                children: [
                                                                    tank.average_temp,
                                                                    "°C"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1172,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1167,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.metricBox,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.metricHeader,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"], {
                                                                        size: 16,
                                                                        color: "#3b82f6"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1176,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: styles.metricLabel,
                                                                        children: "Water Level"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1177,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1175,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.metricValue,
                                                                children: [
                                                                    tank.water_lvl_mm,
                                                                    "mm / ",
                                                                    tank.water_volume,
                                                                    " L "
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1179,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1174,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1166,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.quantitySection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.quantityTitle,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                                                size: 16,
                                                                color: "#6366f1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1186,
                                                                columnNumber: 17
                                                            }, this),
                                                            "Daily Quantities"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1185,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.quantityGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.quantityItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: styles.quantityLabel,
                                                                        children: "Opening (Endpoint)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1191,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: styles.quantityValue,
                                                                        children: "75,450 L"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1192,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1190,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.quantityItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: styles.quantityLabel,
                                                                        children: "Closing (Endpoint)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1195,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: styles.quantityValue,
                                                                        children: "71,250 L"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1196,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1194,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.quantityItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            ...styles.quantityLabel,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '4px'
                                                                        },
                                                                        children: [
                                                                            "Opening (Manual)",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                style: styles.editButton,
                                                                                onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#f1f5f9',
                                                                                onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                                                    size: 12,
                                                                                    color: "#64748b"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                                    lineNumber: 1202,
                                                                                    columnNumber: 23
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                                lineNumber: 1201,
                                                                                columnNumber: 21
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1199,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: styles.quantityValue,
                                                                        children: "75,400 L"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1205,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1198,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.quantityItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            ...styles.quantityLabel,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '4px'
                                                                        },
                                                                        children: [
                                                                            "Closing (Manual)",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                style: styles.editButton,
                                                                                onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#f1f5f9',
                                                                                onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                                                    size: 12,
                                                                                    color: "#64748b"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                                    lineNumber: 1211,
                                                                                    columnNumber: 23
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                                lineNumber: 1210,
                                                                                columnNumber: 21
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1208,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: styles.quantityValue,
                                                                        children: "71,180 L"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1214,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1207,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1189,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1184,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.quantitySection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.quantityTitle,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                                                size: 16,
                                                                color: "#dc2626"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1222,
                                                                columnNumber: 17
                                                            }, this),
                                                            "Daily Filling"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1221,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            ...styles.quantityGrid,
                                                            gridTemplateColumns: '1fr'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.quantityItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: styles.quantityLabel,
                                                                        children: "Tanker Name"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1227,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "Enter tanker name",
                                                                        style: styles.inputField,
                                                                        onFocus: (e)=>e.target.style.borderColor = '#3b82f6',
                                                                        onBlur: (e)=>e.target.style.borderColor = '#e2e8f0'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1228,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1226,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.quantityItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: styles.quantityLabel,
                                                                        children: "Truck Number"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1237,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "Enter truck number",
                                                                        style: styles.inputField,
                                                                        onFocus: (e)=>e.target.style.borderColor = '#3b82f6',
                                                                        onBlur: (e)=>e.target.style.borderColor = '#e2e8f0'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1238,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1236,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.quantityItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: styles.quantityLabel,
                                                                        children: "Filling Value (Manual)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1247,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        placeholder: "Enter filling amount",
                                                                        style: styles.inputField,
                                                                        onFocus: (e)=>e.target.style.borderColor = '#3b82f6',
                                                                        onBlur: (e)=>e.target.style.borderColor = '#e2e8f0'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1248,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1246,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.quantityItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: styles.quantityLabel,
                                                                        children: "ATG Value (Endpoint)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1257,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            ...styles.quantityValue,
                                                                            color: '#6366f1'
                                                                        },
                                                                        children: "15,250 L"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1258,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1256,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.quantityItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: styles.quantityLabel,
                                                                        children: "Difference (Manual - ATG)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1261,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            ...styles.quantityValue,
                                                                            color: '#dc2626'
                                                                        },
                                                                        children: "-150 L"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1262,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: '11px',
                                                                            color: '#dc2626',
                                                                            marginTop: '2px'
                                                                        },
                                                                        children: "Manual value lower than ATG"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1263,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1260,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1225,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1220,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, tank.id, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1133,
                                        columnNumber: 11
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        ...styles.tankCard,
                                        textAlign: 'center',
                                        padding: '48px 24px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            size: 48,
                                            color: "#f59e0b",
                                            style: {
                                                marginBottom: '16px'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 1277,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            style: {
                                                color: '#374151',
                                                marginBottom: '8px'
                                            },
                                            children: "No Tank Data Available"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 1278,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: '#6b7280'
                                            },
                                            children: "Unable to load tank information. Please check your connection or try again later."
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 1279,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 1272,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1130,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                        lineNumber: 1028,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.nozzleSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: styles.nozzleTitle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                        size: 20,
                                        color: "#16a34a"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1289,
                                        columnNumber: 13
                                    }, this),
                                    "Fuel Pricing & Sales"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1288,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.nozzleGrid,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.nozzleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleHeader,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: styles.nozzleName,
                                                        children: "Unleaded Price"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1295,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            ...styles.nozzleStatus,
                                                            color: '#166534',
                                                            backgroundColor: '#dcfce7'
                                                        },
                                                        children: "Active"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1296,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1294,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleMetrics,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.nozzleMetricValue,
                                                                    fontSize: '20px'
                                                                },
                                                                children: "1.45 TSH"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1306,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Per Liter"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1307,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1305,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricValue,
                                                                children: "4,220 L"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1310,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Sold Today"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1311,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1309,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1304,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1293,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.nozzleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleHeader,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: styles.nozzleName,
                                                        children: "Diesel Price"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1317,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            ...styles.nozzleStatus,
                                                            color: '#166534',
                                                            backgroundColor: '#dcfce7'
                                                        },
                                                        children: "Active"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1318,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1316,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleMetrics,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.nozzleMetricValue,
                                                                    fontSize: '20px'
                                                                },
                                                                children: "1.52 TSH"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1328,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Per Liter"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1329,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1327,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricValue,
                                                                children: "5,800 L"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1332,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Sold Today"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1333,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1331,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1326,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1315,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1292,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                        lineNumber: 1287,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.nozzleSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: styles.nozzleTitle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                        size: 20,
                                        color: "#2563eb"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1345,
                                        columnNumber: 5
                                    }, this),
                                    "⛽ Unleaded Sales Analysis"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1344,
                                columnNumber: 3
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.nozzleGrid,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.nozzleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleHeader,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: styles.nozzleName,
                                                    children: "E_Total Sales"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1351,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1350,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleMetrics,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricValue,
                                                                children: "4,220 L"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1356,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Total Liters"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1357,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1355,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.nozzleMetricValue,
                                                                    color: '#16a34a'
                                                                },
                                                                children: " 6,119 TSH"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1360,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Cash Value"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1361,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1359,
                                                        columnNumber: 9
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1354,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1349,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.nozzleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleHeader,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: styles.nozzleName,
                                                    children: "V_Total Sales"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1368,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1367,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleMetrics,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricValue,
                                                                children: "4,150 L"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1373,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Total Liters"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1374,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1372,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.nozzleMetricValue,
                                                                    color: '#7c3aed'
                                                                },
                                                                children: "Volume Only"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1377,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "No Price"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1378,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1376,
                                                        columnNumber: 9
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1371,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1366,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.nozzleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleHeader,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: styles.nozzleName,
                                                    children: "E_Total vs V_Total"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1385,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1384,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleMetrics,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.nozzleMetricValue,
                                                                    color: '#ca8a04'
                                                                },
                                                                children: "+70 L"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1390,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Difference"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1391,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1389,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.nozzleMetricValue,
                                                                    color: '#ca8a04'
                                                                },
                                                                children: "+1.7%"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1394,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Variance"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1395,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1393,
                                                        columnNumber: 9
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1388,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1383,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.nozzleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleHeader,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: styles.nozzleName,
                                                    children: "M_Total Sales"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1402,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1401,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleMetrics,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricValue,
                                                                children: "4,200 L"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1407,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Total Liters"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1408,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1406,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.nozzleMetricValue,
                                                                    color: '#dc2626'
                                                                },
                                                                children: "Manual Entry"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1411,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "User Input"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1412,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1410,
                                                        columnNumber: 9
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1405,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1400,
                                        columnNumber: 5
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1348,
                                columnNumber: 3
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                        lineNumber: 1343,
                        columnNumber: 1
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.nozzleSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: styles.nozzleTitle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                        size: 20,
                                        color: "#16a34a"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1422,
                                        columnNumber: 5
                                    }, this),
                                    "🚛 Diesel Sales Analysis"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1421,
                                columnNumber: 3
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.nozzleGrid,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.nozzleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleHeader,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: styles.nozzleName,
                                                    children: "E_Total Sales"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1428,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1427,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleMetrics,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricValue,
                                                                children: "5,800 L"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1433,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Total Liters"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1434,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1432,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.nozzleMetricValue,
                                                                    color: '#16a34a'
                                                                },
                                                                children: " 8,816 TSH"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1437,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Cash Value"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1438,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1436,
                                                        columnNumber: 9
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1431,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1426,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.nozzleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleHeader,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: styles.nozzleName,
                                                    children: "V_Total Sales"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1445,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1444,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleMetrics,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricValue,
                                                                children: "5,750 L"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1450,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Total Liters"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1451,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1449,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.nozzleMetricValue,
                                                                    color: '#7c3aed'
                                                                },
                                                                children: "Volume Only"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1454,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "No Price"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1455,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1453,
                                                        columnNumber: 9
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1448,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1443,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.nozzleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleHeader,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: styles.nozzleName,
                                                    children: "E_Total vs V_Total"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1462,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1461,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleMetrics,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.nozzleMetricValue,
                                                                    color: '#ca8a04'
                                                                },
                                                                children: "+50 L"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1467,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Difference"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1468,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1466,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.nozzleMetricValue,
                                                                    color: '#ca8a04'
                                                                },
                                                                children: "+0.9%"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1471,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Variance"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1472,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1470,
                                                        columnNumber: 9
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1465,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1460,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.nozzleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleHeader,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: styles.nozzleName,
                                                    children: "M_Total Sales"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1479,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1478,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: styles.nozzleMetrics,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricValue,
                                                                children: "5,780 L"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1484,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "Total Liters"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1485,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1483,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleMetric,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    ...styles.nozzleMetricValue,
                                                                    color: '#dc2626'
                                                                },
                                                                children: "Manual Entry"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1488,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: styles.nozzleMetricLabel,
                                                                children: "User Input"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1489,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1487,
                                                        columnNumber: 9
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1482,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1477,
                                        columnNumber: 5
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1425,
                                columnNumber: 3
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                        lineNumber: 1420,
                        columnNumber: 1
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.statsGrid,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.statCard,
                                onMouseEnter: (e)=>e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                onMouseLeave: (e)=>e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.statHeader,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...styles.statIcon,
                                                    backgroundColor: '#dcfce7'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        color: '#16a34a'
                                                    },
                                                    children: "TSH"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1504,
                                                    columnNumber: 3
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1503,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    ...styles.statusBadge,
                                                    color: '#166534',
                                                    backgroundColor: '#dcfce7'
                                                },
                                                children: "+15%"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1506,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1502,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: styles.statValue,
                                        children: "14,629 TSH"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1508,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: styles.statLabel,
                                        children: "E_Total Revenue"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1509,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.statFooter,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                size: 12,
                                                style: {
                                                    marginRight: '4px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1511,
                                                columnNumber: 15
                                            }, this),
                                            "vs yesterday"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1510,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1497,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.statCard,
                                onMouseEnter: (e)=>e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                onMouseLeave: (e)=>e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.statHeader,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...styles.statIcon,
                                                    backgroundColor: '#f0fdf4'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        color: '#16a34a'
                                                    },
                                                    children: "💰"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1523,
                                                    columnNumber: 15
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1522,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    ...styles.statusBadge,
                                                    color: '#166534',
                                                    backgroundColor: '#dcfce7'
                                                },
                                                children: "Manual"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1525,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1521,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: styles.statValue,
                                        children: managerCash ? "".concat(parseFloat(managerCash).toLocaleString(), " TSH") : 'No Entry'
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1527,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: styles.statLabel,
                                        children: "Manager's Cash"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1530,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.statFooter,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                size: 12,
                                                style: {
                                                    marginRight: '4px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1532,
                                                columnNumber: 13
                                            }, this),
                                            "Manual count"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1531,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1516,
                                columnNumber: 19
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.statCard,
                                onMouseEnter: (e)=>e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                onMouseLeave: (e)=>e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.statHeader,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...styles.statIcon,
                                                    backgroundColor: '#f3e8ff'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                                    size: 24,
                                                    color: "#9333ea"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1544,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1543,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    ...styles.statusBadge,
                                                    color: '#166534',
                                                    backgroundColor: '#dcfce7'
                                                },
                                                children: pumpsLoading ? 'Loading...' : "".concat(nozzleData.filter((n)=>n.status).length, "/").concat(nozzleData.length, " Online")
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1546,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1542,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: styles.statValue,
                                        children: pumpsLoading ? '...' : "".concat(nozzleData.filter((n)=>n.status).length, "/").concat(nozzleData.length)
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1550,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: styles.statLabel,
                                        children: "Pumps/Nozzles Active"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1553,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.statFooter,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                size: 12,
                                                style: {
                                                    marginRight: '4px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1555,
                                                columnNumber: 15
                                            }, this),
                                            pumpsLoading ? 'Loading...' : "".concat(Math.round(nozzleData.filter((n)=>n.status).length / nozzleData.length * 100), "% uptime")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1554,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1537,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.statCard,
                                onMouseEnter: (e)=>e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                onMouseLeave: (e)=>e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.statHeader,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...styles.statIcon,
                                                    backgroundColor: '#fef3c7'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                    size: 24,
                                                    color: "#d97706"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1567,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1566,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    ...styles.statusBadge,
                                                    color: '#ca8a04',
                                                    backgroundColor: '#fef3c7'
                                                },
                                                children: "Monitor"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1569,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1565,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: styles.statValue,
                                        children: "+70 L"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1571,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: styles.statLabel,
                                        children: "E vs V Difference"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1572,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.statFooter,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                size: 12,
                                                color: "#ca8a04",
                                                style: {
                                                    marginRight: '4px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1574,
                                                columnNumber: 15
                                            }, this),
                                            "Check variance"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1573,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1560,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                        lineNumber: 1496,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.nozzleSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: styles.nozzleTitle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                        size: 20,
                                        color: "#6366f1"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1582,
                                        columnNumber: 5
                                    }, this),
                                    "Pump/Nozzle Performance",
                                    pumpsLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.loadingState,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                size: 16,
                                                className: "animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1586,
                                                columnNumber: 9
                                            }, this),
                                            "Loading pump data..."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1585,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1581,
                                columnNumber: 3
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: '32px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#2563eb',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: "⛽ Unleaded Nozzles"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1594,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.nozzleGrid,
                                        children: nozzleData.filter((nozzle)=>nozzle.name.toLowerCase().includes('unleaded') || nozzle.name.toLowerCase().includes('petrol') || nozzle.name.toLowerCase().includes('pms') || nozzle.name.includes('A2')).map((nozzle)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...styles.nozzleCard,
                                                    padding: '20px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleHeader,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: styles.nozzleName,
                                                                children: nozzle.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1617,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    ...styles.nozzleStatus,
                                                                    color: nozzle.status ? '#166534' : '#dc2626',
                                                                    backgroundColor: nozzle.status ? '#dcfce7' : '#fee2e2'
                                                                },
                                                                children: nozzle.status ? 'Active' : 'Inactive'
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1618,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1616,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'grid',
                                                            gridTemplateColumns: '1fr 1fr',
                                                            gap: '12px',
                                                            marginTop: '16px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    background: '#f8fafc',
                                                                    borderRadius: '8px',
                                                                    padding: '12px',
                                                                    border: '1px solid #e2e8f0',
                                                                    textAlign: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '14px',
                                                                            fontWeight: 'bold',
                                                                            color: '#1e293b',
                                                                            margin: 0
                                                                        },
                                                                        children: [
                                                                            nozzle.sold.toLocaleString(),
                                                                            " L"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1642,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '10px',
                                                                            color: '#64748b',
                                                                            margin: '2px 0 0 0'
                                                                        },
                                                                        children: "Sold Today"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1650,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1635,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    background: '#f8fafc',
                                                                    borderRadius: '8px',
                                                                    padding: '12px',
                                                                    border: '1px solid #e2e8f0',
                                                                    textAlign: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '14px',
                                                                            fontWeight: 'bold',
                                                                            color: '#1e293b',
                                                                            margin: 0
                                                                        },
                                                                        children: [
                                                                            (nozzle.sold * 0.95).toFixed(0),
                                                                            " L"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1667,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '10px',
                                                                            color: '#64748b',
                                                                            margin: '2px 0 0 0'
                                                                        },
                                                                        children: "E-Total"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1675,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1660,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    background: '#f8fafc',
                                                                    borderRadius: '8px',
                                                                    padding: '12px',
                                                                    border: '1px solid #e2e8f0',
                                                                    textAlign: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '14px',
                                                                            fontWeight: 'bold',
                                                                            color: '#1e293b',
                                                                            margin: 0
                                                                        },
                                                                        children: [
                                                                            (nozzle.sold * 0.92).toFixed(0),
                                                                            " L"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1692,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '10px',
                                                                            color: '#64748b',
                                                                            margin: '2px 0 0 0'
                                                                        },
                                                                        children: "V-Total"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1700,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1685,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    background: '#f8fafc',
                                                                    borderRadius: '8px',
                                                                    padding: '8px',
                                                                    border: '1px solid #e2e8f0',
                                                                    textAlign: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        placeholder: "Enter",
                                                                        style: {
                                                                            width: '100%',
                                                                            padding: '4px 6px',
                                                                            border: '1px solid #cbd5e1',
                                                                            borderRadius: '4px',
                                                                            fontSize: '12px',
                                                                            fontWeight: 'bold',
                                                                            textAlign: 'center',
                                                                            color: '#1e293b',
                                                                            outline: 'none',
                                                                            background: '#ffffff'
                                                                        },
                                                                        onFocus: (e)=>e.target.style.borderColor = '#3b82f6',
                                                                        onBlur: (e)=>e.target.style.borderColor = '#cbd5e1'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1717,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '10px',
                                                                            color: '#64748b',
                                                                            margin: '4px 0 0 0'
                                                                        },
                                                                        children: "M-Total"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1735,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1710,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1628,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, nozzle.id, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1612,
                                                columnNumber: 11
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1605,
                                        columnNumber: 5
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1593,
                                columnNumber: 3
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#16a34a',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: "🚛 Diesel Nozzles"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1751,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.nozzleGrid,
                                        children: nozzleData.filter((nozzle)=>nozzle.name.toLowerCase().includes('diesel') || nozzle.name.toLowerCase().includes('ago') || nozzle.name.includes('A1')).map((nozzle)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...styles.nozzleCard,
                                                    padding: '20px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.nozzleHeader,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: styles.nozzleName,
                                                                children: nozzle.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1773,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    ...styles.nozzleStatus,
                                                                    color: nozzle.status ? '#166534' : '#dc2626',
                                                                    backgroundColor: nozzle.status ? '#dcfce7' : '#fee2e2'
                                                                },
                                                                children: nozzle.status ? 'Active' : 'Inactive'
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1774,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1772,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'grid',
                                                            gridTemplateColumns: '1fr 1fr',
                                                            gap: '12px',
                                                            marginTop: '16px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    background: '#f8fafc',
                                                                    borderRadius: '8px',
                                                                    padding: '12px',
                                                                    border: '1px solid #e2e8f0',
                                                                    textAlign: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '14px',
                                                                            fontWeight: 'bold',
                                                                            color: '#1e293b',
                                                                            margin: 0
                                                                        },
                                                                        children: [
                                                                            nozzle.sold.toLocaleString(),
                                                                            " L"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1798,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '10px',
                                                                            color: '#64748b',
                                                                            margin: '2px 0 0 0'
                                                                        },
                                                                        children: "Sold Today"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1806,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1791,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    background: '#f8fafc',
                                                                    borderRadius: '8px',
                                                                    padding: '12px',
                                                                    border: '1px solid #e2e8f0',
                                                                    textAlign: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '14px',
                                                                            fontWeight: 'bold',
                                                                            color: '#1e293b',
                                                                            margin: 0
                                                                        },
                                                                        children: [
                                                                            (nozzle.sold * 0.95).toFixed(0),
                                                                            " L"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1823,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '10px',
                                                                            color: '#64748b',
                                                                            margin: '2px 0 0 0'
                                                                        },
                                                                        children: "E-Total"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1831,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1816,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    background: '#f8fafc',
                                                                    borderRadius: '8px',
                                                                    padding: '12px',
                                                                    border: '1px solid #e2e8f0',
                                                                    textAlign: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '14px',
                                                                            fontWeight: 'bold',
                                                                            color: '#1e293b',
                                                                            margin: 0
                                                                        },
                                                                        children: [
                                                                            (nozzle.sold * 0.92).toFixed(0),
                                                                            " L"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1848,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '10px',
                                                                            color: '#64748b',
                                                                            margin: '2px 0 0 0'
                                                                        },
                                                                        children: "V-Total"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1856,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1841,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    background: '#f8fafc',
                                                                    borderRadius: '8px',
                                                                    padding: '8px',
                                                                    border: '1px solid #e2e8f0',
                                                                    textAlign: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        placeholder: "Enter",
                                                                        style: {
                                                                            width: '100%',
                                                                            padding: '4px 6px',
                                                                            border: '1px solid #cbd5e1',
                                                                            borderRadius: '4px',
                                                                            fontSize: '12px',
                                                                            fontWeight: 'bold',
                                                                            textAlign: 'center',
                                                                            color: '#1e293b',
                                                                            outline: 'none',
                                                                            background: '#ffffff'
                                                                        },
                                                                        onFocus: (e)=>e.target.style.borderColor = '#3b82f6',
                                                                        onBlur: (e)=>e.target.style.borderColor = '#cbd5e1'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1873,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: '10px',
                                                                            color: '#64748b',
                                                                            margin: '4px 0 0 0'
                                                                        },
                                                                        children: "M-Total"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                        lineNumber: 1891,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 1866,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 1784,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, nozzle.id, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1768,
                                                columnNumber: 11
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1762,
                                        columnNumber: 5
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1750,
                                columnNumber: 3
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                        lineNumber: 1580,
                        columnNumber: 1
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.actionsCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: styles.actionsTitle,
                                children: "Quick Actions"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1910,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.actionsGrid,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        style: {
                                            ...styles.actionButton,
                                            backgroundColor: '#dbeafe',
                                            color: '#1e40af'
                                        },
                                        onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#bfdbfe',
                                        onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '#dbeafe',
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"], {
                                                size: 24,
                                                style: {
                                                    marginBottom: '8px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1917,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Update Levels"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1918,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1912,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowSalesModal(true),
                                        style: {
                                            ...styles.actionButton,
                                            backgroundColor: '#dcfce7',
                                            color: '#166534'
                                        },
                                        onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#bbf7d0',
                                        onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '#dcfce7',
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '24px',
                                                    marginBottom: '8px'
                                                },
                                                children: "💰"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1926,
                                                columnNumber: 3
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Record Sales"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1927,
                                                columnNumber: 3
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1920,
                                        columnNumber: 12
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowChecklistModal(true),
                                        style: {
                                            ...styles.actionButton,
                                            backgroundColor: '#f3e8ff',
                                            color: '#7c3aed'
                                        },
                                        onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#e9d5ff',
                                        onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '#f3e8ff',
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                size: 24,
                                                style: {
                                                    marginBottom: '8px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1935,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Checklist"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1936,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1929,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowIssueModal(true),
                                        style: {
                                            ...styles.actionButton,
                                            backgroundColor: '#fed7aa',
                                            color: '#c2410c'
                                        },
                                        onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#fdba74',
                                        onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '#fed7aa',
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                size: 24,
                                                style: {
                                                    marginBottom: '8px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1944,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Report Issue"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 1945,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1938,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                lineNumber: 1911,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                        lineNumber: 1909,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.successMessage,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.messageContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.messageIcon,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                        size: 24,
                                        color: "#2563eb"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                        lineNumber: 1954,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 1953,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            style: styles.messageTitle,
                                            children: "🎉 Station System Active"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 1957,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: styles.messageText,
                                            children: [
                                                "Your station monitoring tools are running perfectly! Tank levels, sales tracking, pump monitoring, and alert systems are all operational.",
                                                !pumpsLoading && " Currently monitoring ".concat(nozzleData.length, " pumps/nozzles.")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 1958,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 1956,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                            lineNumber: 1952,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                        lineNumber: 1951,
                        columnNumber: 9
                    }, this),
                    showChecklistModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.modalOverlay,
                        onClick: handleCloseModal,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.modalContent,
                            onClick: (e)=>e.stopPropagation(),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalHeader,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            style: styles.modalTitle,
                                            children: "Daily Safety Checklist"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 1971,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCloseModal,
                                            style: styles.closeButton,
                                            onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#f3f4f6',
                                            onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
                                            children: "✕"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 1972,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 1970,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.checklistContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                ...styles.checklistItem,
                                                ...checklistItems.calibration ? styles.checklistItemChecked : {}
                                            },
                                            onClick: ()=>handleChecklistItemChange('calibration'),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        ...styles.checkbox,
                                                        ...checklistItems.calibration ? styles.checkboxChecked : {}
                                                    },
                                                    children: checklistItems.calibration && '✓'
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1990,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        ...styles.checklistLabel,
                                                        ...checklistItems.calibration ? styles.checklistLabelChecked : {}
                                                    },
                                                    children: "Calibration completed and verified?"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 1998,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 1983,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                ...styles.checklistItem,
                                                ...checklistItems.pipelineLeak ? styles.checklistItemChecked : {}
                                            },
                                            onClick: ()=>handleChecklistItemChange('pipelineLeak'),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        ...styles.checkbox,
                                                        ...checklistItems.pipelineLeak ? styles.checkboxChecked : {}
                                                    },
                                                    children: checklistItems.pipelineLeak && '✓'
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2015,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        ...styles.checklistLabel,
                                                        ...checklistItems.pipelineLeak ? styles.checklistLabelChecked : {}
                                                    },
                                                    children: "Pipeline inspected for leaks or damage?"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2023,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2008,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                ...styles.checklistItem,
                                                ...checklistItems.tankLeak ? styles.checklistItemChecked : {}
                                            },
                                            onClick: ()=>handleChecklistItemChange('tankLeak'),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        ...styles.checkbox,
                                                        ...checklistItems.tankLeak ? styles.checkboxChecked : {}
                                                    },
                                                    children: checklistItems.tankLeak && '✓'
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2040,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        ...styles.checklistLabel,
                                                        ...checklistItems.tankLeak ? styles.checklistLabelChecked : {}
                                                    },
                                                    children: "Storage tanks checked for leaks or structural issues?"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2048,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2033,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                ...styles.checklistItem,
                                                ...checklistItems.safetyEquipment ? styles.checklistItemChecked : {}
                                            },
                                            onClick: ()=>handleChecklistItemChange('safetyEquipment'),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        ...styles.checkbox,
                                                        ...checklistItems.safetyEquipment ? styles.checkboxChecked : {}
                                                    },
                                                    children: checklistItems.safetyEquipment && '✓'
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2065,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        ...styles.checklistLabel,
                                                        ...checklistItems.safetyEquipment ? styles.checklistLabelChecked : {}
                                                    },
                                                    children: "Safety equipment functional and accessible?"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2073,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2058,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 1982,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalFooter,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCloseModal,
                                            style: {
                                                ...styles.modalButton,
                                                ...styles.cancelButton
                                            },
                                            onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#e5e7eb',
                                            onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '#f3f4f6',
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2085,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleSaveChecklist,
                                            style: {
                                                ...styles.modalButton,
                                                ...styles.saveButton
                                            },
                                            onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#15803d',
                                            onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '#16a34a',
                                            children: "Save Checklist"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2093,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 2084,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                            lineNumber: 1969,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                        lineNumber: 1968,
                        columnNumber: 11
                    }, this),
                    showSalesModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.modalOverlay,
                        onClick: handleCloseSalesModal,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.modalContent,
                            onClick: (e)=>e.stopPropagation(),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalHeader,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            style: styles.modalTitle,
                                            children: "Daily Sales Record"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2111,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCloseSalesModal,
                                            style: styles.closeButton,
                                            onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#f3f4f6',
                                            onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
                                            children: "✕"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2112,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 2110,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.checklistContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: styles.salesRow,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.salesLabel,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.salesIcon,
                                                                    children: "⛽"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                    lineNumber: 2127,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Unleaded Sales"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2126,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.salesDetails,
                                                            children: [
                                                                salesData.unleaded.liters.toLocaleString(),
                                                                " L × TSH ",
                                                                salesData.unleaded.pricePerLiter
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2130,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2125,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: styles.salesValue,
                                                    children: [
                                                        "TSH",
                                                        salesData.unleaded.cash.toLocaleString()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2134,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2124,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: styles.salesRow,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.salesLabel,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.salesIcon,
                                                                    children: "🚛"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                    lineNumber: 2143,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Diesel Sales"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2142,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.salesDetails,
                                                            children: [
                                                                salesData.diesel.liters.toLocaleString(),
                                                                " L × TSH",
                                                                salesData.diesel.pricePerLiter
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2146,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2141,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: styles.salesValue,
                                                    children: [
                                                        "TSH",
                                                        salesData.diesel.cash.toLocaleString()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2150,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2140,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                ...styles.salesRow,
                                                ...styles.salesRowTotal
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.salesLabel,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.salesIcon,
                                                                    children: "📊"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                    lineNumber: 2159,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Total Fuel Sales (Unleaded + Diesel)"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2158,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.salesDetails,
                                                            children: "Combined cash from both fuel types"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2162,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2157,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        ...styles.salesValue,
                                                        color: '#1d4ed8'
                                                    },
                                                    children: [
                                                        "TSH",
                                                        (salesData.unleaded.cash + salesData.diesel.cash).toLocaleString()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2166,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2156,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                ...styles.salesRow,
                                                ...styles.salesRowETotals
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.salesLabel,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.salesIcon,
                                                                    children: "💰"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                    lineNumber: 2175,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "E_Total System Revenue"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2174,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.salesDetails,
                                                            children: "Electronic system total (includes all transactions)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2178,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2173,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        ...styles.salesValue,
                                                        ...styles.salesValueHighlight
                                                    },
                                                    children: [
                                                        "TSH",
                                                        salesData.eTotalCash.toLocaleString()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2182,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2172,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                ...styles.salesRow,
                                                backgroundColor: '#f0fdf4',
                                                borderColor: '#22c55e'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.salesLabel,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.salesIcon,
                                                                    children: "💰"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                    lineNumber: 2194,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Manager's Cash (Manual Entry)"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2193,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.salesDetails,
                                                            children: "Cash counted by station manager"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2197,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2192,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            placeholder: "Enter amount",
                                                            value: managerCash,
                                                            onChange: (e)=>setManagerCash(e.target.value),
                                                            style: {
                                                                padding: '8px 12px',
                                                                border: '1px solid #22c55e',
                                                                borderRadius: '6px',
                                                                fontSize: '16px',
                                                                fontWeight: '600',
                                                                width: '140px',
                                                                textAlign: 'right',
                                                                outline: 'none'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2206,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '16px',
                                                                fontWeight: '600',
                                                                color: '#16a34a'
                                                            },
                                                            children: "TSH"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2222,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2201,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2187,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                ...styles.salesRow,
                                                backgroundColor: '#fef3c7',
                                                borderColor: '#f59e0b'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.salesLabel,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.salesIcon,
                                                                    children: "📈"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                    lineNumber: 2234,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Variance Analysis"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2233,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.salesDetails,
                                                            children: "Difference between manual calculation and E_Total"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2237,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2232,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        ...styles.salesValue,
                                                        color: salesData.eTotalCash - (salesData.unleaded.cash + salesData.diesel.cash) >= 0 ? '#16a34a' : '#dc2626'
                                                    },
                                                    children: [
                                                        salesData.eTotalCash - (salesData.unleaded.cash + salesData.diesel.cash) >= 0 ? '+' : '',
                                                        (salesData.eTotalCash - (salesData.unleaded.cash + salesData.diesel.cash)).toLocaleString(),
                                                        "TSH"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2241,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2227,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 2122,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalFooter,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCloseSalesModal,
                                            style: {
                                                ...styles.modalButton,
                                                ...styles.cancelButton
                                            },
                                            onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#e5e7eb',
                                            onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '#f3f4f6',
                                            children: "Close"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2254,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleSaveSales,
                                            style: {
                                                ...styles.modalButton,
                                                ...styles.saveButton
                                            },
                                            onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#15803d',
                                            onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '#16a34a',
                                            children: "Record Sales"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2262,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 2253,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                            lineNumber: 2109,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                        lineNumber: 2108,
                        columnNumber: 11
                    }, this),
                    showIssueModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.modalOverlay,
                        onClick: handleCloseIssueModal,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.modalContent,
                            onClick: (e)=>e.stopPropagation(),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalHeader,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            style: styles.modalTitle,
                                            children: "🚨 Report Station Issue"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2280,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCloseIssueModal,
                                            style: styles.closeButton,
                                            onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#f3f4f6',
                                            onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
                                            children: "✕"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2281,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 2279,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.checklistContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: styles.formGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: styles.formLabel,
                                                    children: "Issue Category"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2294,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: issueCategory,
                                                    onChange: (e)=>setIssueCategory(e.target.value),
                                                    style: {
                                                        ...styles.selectField,
                                                        ...issueCategory === 'emergency' ? styles.urgentCategory : {}
                                                    },
                                                    onFocus: (e)=>e.target.style.borderColor = '#3b82f6',
                                                    onBlur: (e)=>e.target.style.borderColor = '#e2e8f0',
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "general",
                                                            children: "🔧 General Issue"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2305,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "equipment",
                                                            children: "⚙️ Equipment Malfunction"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2306,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "safety",
                                                            children: "⚠️ Safety Concern"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2307,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "fuel",
                                                            children: "⛽ Fuel System Problem"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2308,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "power",
                                                            children: "🔌 Power/Electrical Issue"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2309,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "emergency",
                                                            children: "🚨 EMERGENCY"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2310,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2295,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2293,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: styles.formGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: styles.formLabel,
                                                    children: [
                                                        "Issue Description",
                                                        issueCategory === 'emergency' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: '#dc2626'
                                                            },
                                                            children: " (URGENT)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                            lineNumber: 2318,
                                                            columnNumber: 55
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2316,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: issueMessage,
                                                    onChange: (e)=>setIssueMessage(e.target.value),
                                                    placeholder: "Please describe the issue in detail. Include location, time noticed, severity, and any immediate actions taken...",
                                                    style: {
                                                        ...styles.textarea,
                                                        ...issueCategory === 'emergency' ? styles.urgentCategory : {}
                                                    },
                                                    onFocus: (e)=>e.target.style.borderColor = '#3b82f6',
                                                    onBlur: (e)=>e.target.style.borderColor = '#e2e8f0',
                                                    maxLength: 500
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2320,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: styles.characterCount,
                                                    children: [
                                                        issueMessage.length,
                                                        "/500 characters"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                    lineNumber: 2332,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2315,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                ...styles.salesRow,
                                                backgroundColor: '#f0f9ff',
                                                borderColor: '#0ea5e9'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: styles.salesLabel,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: styles.salesIcon,
                                                                children: "📱"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 2345,
                                                                columnNumber: 23
                                                            }, this),
                                                            "SMS Preview to General Manager"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 2344,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '12px',
                                                            color: '#374151',
                                                            marginTop: '8px',
                                                            fontStyle: 'italic',
                                                            padding: '8px',
                                                            backgroundColor: '#ffffff',
                                                            borderRadius: '6px',
                                                            border: '1px solid #e2e8f0'
                                                        },
                                                        children: [
                                                            '"STATION ALERT: ',
                                                            (stationData === null || stationData === void 0 ? void 0 : stationData.name) || 'Station',
                                                            " - ",
                                                            issueCategory.toUpperCase(),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 2358,
                                                                columnNumber: 103
                                                            }, this),
                                                            issueMessage || '[Issue description will appear here]',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 2359,
                                                                columnNumber: 79
                                                            }, this),
                                                            "Reported by: Station Manager",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                                lineNumber: 2360,
                                                                columnNumber: 51
                                                            }, this),
                                                            "Time: ",
                                                            new Date().toLocaleString(),
                                                            '"'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 2348,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                lineNumber: 2343,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2338,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 2291,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalFooter,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCloseIssueModal,
                                            style: {
                                                ...styles.modalButton,
                                                ...styles.cancelButton
                                            },
                                            onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#e5e7eb',
                                            onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '#f3f4f6',
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2368,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleSendIssueReport,
                                            disabled: issueSending || !issueMessage.trim(),
                                            style: {
                                                ...styles.modalButton,
                                                ...issueCategory === 'emergency' ? {
                                                    backgroundColor: '#dc2626'
                                                } : styles.saveButton,
                                                ...issueSending ? styles.sendingButton : {}
                                            },
                                            onMouseEnter: (e)=>{
                                                if (!issueSending && issueMessage.trim()) {
                                                    e.currentTarget.style.backgroundColor = issueCategory === 'emergency' ? '#b91c1c' : '#15803d';
                                                }
                                            },
                                            onMouseLeave: (e)=>{
                                                if (!issueSending && issueMessage.trim()) {
                                                    e.currentTarget.style.backgroundColor = issueCategory === 'emergency' ? '#dc2626' : '#16a34a';
                                                }
                                            },
                                            children: issueSending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        size: 16,
                                                        style: {
                                                            marginRight: '8px',
                                                            animation: 'spin 1s linear infinite'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                                        lineNumber: 2397,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Sending SMS..."
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    "📱 Send SMS Alert",
                                                    issueCategory === 'emergency' && ' (URGENT)'
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                            lineNumber: 2376,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                                    lineNumber: 2367,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                            lineNumber: 2278,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                        lineNumber: 2277,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
                lineNumber: 958,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/app/dashboard/station/page.tsx",
        lineNumber: 914,
        columnNumber: 5
    }, this);
}
_s(StationDashboard, "rn+i3R3U7xxQsIbrJECMBSr5Ct4=");
_c = StationDashboard;
var _c;
__turbopack_context__.k.register(_c, "StationDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=frontend_src_67c4a0e1._.js.map