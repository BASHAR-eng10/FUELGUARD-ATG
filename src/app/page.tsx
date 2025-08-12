
'use client'
import React from 'react';

import { useRouter } from 'next/navigation'

// page shoud reroute to signin if not authenticated
export default function Home() {
	const router = useRouter();

	React.useEffect(() => {
		router.push('/signin');
	}, [router]);

	return null;
}



// export default function EnhancedSignIn() {
//   const [email, setEmail] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [message, setMessage] = useState('')
//   const [isSuccess, setIsSuccess] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setMessage('')

//     try {
//       // Check if email is authorized
//       const checkResponse = await fetch('/api/auth/check-email', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       })

//       if (!checkResponse.ok) {
//         throw new Error('Email not authorized')
//       }

//       // Send verification email
//       const response = await fetch('/api/auth/send-verification', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       })

//       if (response.ok) {
//         setIsSuccess(true)
//         setMessage('Verification email sent! Check your console for the verification link (development mode).')
//       } else {
//         throw new Error('Failed to send verification email')
//       }
//     } catch (error) {
//       setMessage(error instanceof Error ? error.message : 'An error occurred')
//       setIsSuccess(false)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
//       <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
//         {/* Logo and Header */}
//         <div className="text-center">
//           <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-6">
//             <Shield className="h-8 w-8 text-white" />
//           </div>
//           <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
//             Welcome Back
//           </h2>
//           <p className="text-gray-600 mb-2">Lake Oil Group</p>
//           <p className="text-sm text-gray-500">
//             Fuel Station Monitoring System
//           </p>
//         </div>

//         {/* Sign In Card */}
//         <div className="mt-8 bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-200">
//           <div className="space-y-6">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   placeholder="Enter your authorized email"
//                 />
//               </div>
//             </div>

//             <button
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               {isLoading ? (
//                 <Loader2 className="h-5 w-5 animate-spin" />
//               ) : (
//                 <>
//                   <span>Sign in with Email</span>
//                   <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Status Message */}
//           {message && (
//             <div className={`mt-6 p-4 rounded-xl border ${
//               isSuccess 
//                 ? 'bg-green-50 border-green-200 text-green-800' 
//                 : 'bg-red-50 border-red-200 text-red-800'
//             }`}>
//               <div className="flex items-center">
//                 {isSuccess ? (
//                   <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
//                 ) : (
//                   <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
//                 )}
//                 <p className="text-sm font-medium">{message}</p>
//               </div>
//             </div>
//           )}

//           {/* Demo Accounts */}
//           <div className="mt-8">
//             <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
//               <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
//                 <Shield className="h-4 w-4 mr-2 text-blue-600" />
//                 Demo Accounts
//               </h3>
//               <div className="space-y-3">
//                 {[
//                   { email: 'manager@fuelstation.com', role: 'General Manager', color: 'blue' },
//                   { email: 'station1@fuelstation.com', role: 'Main Street Station', color: 'green' },
//                   { email: 'station2@fuelstation.com', role: 'Highway Junction', color: 'purple' },
//                   { email: 'station3@fuelstation.com', role: 'Airport Road', color: 'orange' }
//                 ].map((account, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setEmail(account.email)}
//                     className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
//                           {account.email}
//                         </p>
//                         <p className="text-xs text-gray-500">{account.role}</p>
//                       </div>
//                       <div className={`w-2 h-2 rounded-full bg-${account.color}-500`}></div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-8 text-center">
//           <p className="text-xs text-gray-500">
//             Secure authentication powered by NextAuth.js
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }