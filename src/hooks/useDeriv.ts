// components/CreateRemix.jsx
"use client";
import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";

const DERIVATIVE_FACTORY_ADDRESS =
  process.env.NEXT_PUBLIC_DERIVATIVE_FACTORY_ADDRESS;

const DERIVATIVE_FACTORY_ABI = [
  {
    name: "createDerivative",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "parentSongId", type: "uint256" },
      { name: "childSongId", type: "uint256" },
      { name: "metadataURI", type: "string" },
      { name: "derivativeType", type: "string" },
    ],
    outputs: [
      { name: "childTokenId", type: "uint256" },
      { name: "childIpId", type: "address" },
    ],
  },
];

export default function CreateRemix({ parentSongId, parentSongTitle }) {
  const { address, isConnected } = useAccount();

  const [remixType, setRemixType] = useState("Lofi");
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);

  const { writeContract: createDerivative, data: txHash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  /**
   * Upload remix to IPFS
   */
  const uploadRemixToIPFS = async () => {
    if (!audioFile) {
      alert("Please select an audio file");
      return;
    }

    try {
      setUploading(true);

      // Upload audio file
      const formData = new FormData();
      formData.append("file", audioFile);

      const audioRes = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      const { IpfsHash: audioHash } = await audioRes.json();

      // Upload metadata
      const metadata = {
        name: `${parentSongTitle} - ${remixType} Remix`,
        description: `A ${remixType} remix of "${parentSongTitle}"`,
        audio: `ipfs://${audioHash}`,
        attributes: [
          { trait_type: "Type", value: "Derivative" },
          { trait_type: "Remix Type", value: remixType },
          { trait_type: "Parent Song ID", value: parentSongId.toString() },
        ],
      };

      const metadataRes = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: JSON.stringify(metadata),
        }
      );

      const { IpfsHash: metadataHash } = await metadataRes.json();

      window.sessionStorage.setItem(
        "remixMetadataURI",
        `ipfs://${metadataHash}`
      );
      setStep(2);
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Create derivative on blockchain
   */
  const handleCreateRemix = async () => {
    if (!isConnected) {
      alert("Please connect your wallet");
      return;
    }

    const metadataURI = window.sessionStorage.getItem("remixMetadataURI");
    if (!metadataURI) {
      alert("Please upload remix first");
      return;
    }

    try {
      // Generate unique child song ID (in production, get from your system)
      const childSongId = Date.now();

      createDerivative({
        address: DERIVATIVE_FACTORY_ADDRESS,
        abi: DERIVATIVE_FACTORY_ABI,
        functionName: "createDerivative",
        args: [
          BigInt(parentSongId),
          BigInt(childSongId),
          metadataURI,
          remixType,
        ],
      });
    } catch (error) {
      console.error("Remix creation error:", error);
      alert("Failed to create remix: " + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Create Remix</h1>
      <p className="text-gray-600 mb-6">Remixing: {parentSongTitle}</p>

      {/* Important Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important</h3>
        <p className="text-sm text-yellow-700">
          The original artist will automatically receive 15% of all earnings
          from this remix. This is enforced by Story Protocol and cannot be
          changed.
        </p>
      </div>

      {/* Step 1: Upload Remix */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Remix Type</label>
            <select
              value={remixType}
              onChange={(e) => setRemixType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="Lofi">Lofi Remix</option>
              <option value="Spanish">Spanish Version</option>
              <option value="Acoustic">Acoustic Version</option>
              <option value="EDM">EDM Remix</option>
              <option value="Piano">Piano Version</option>
              <option value="Jazz">Jazz Version</option>
              <option value="Rock">Rock Version</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Remix Audio File
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
              className="w-full"
            />
          </div>

          <button
            onClick={uploadRemixToIPFS}
            disabled={uploading || !audioFile}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? "Uploading to IPFS..." : "Upload Remix"}
          </button>
        </div>
      )}

      {/* Step 2: Create on Blockchain */}
      {step === 2 && !isSuccess && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">✅ Remix uploaded to IPFS!</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Ready to Register Remix</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                ✓ Your remix will be registered as a derivative on Story
                Protocol
              </li>
              <li>✓ Original creator gets 15% royalty automatically</li>
              <li>✓ You'll receive 10 LYRIC tokens as reward</li>
              <li>✓ You'll own the remix NFT</li>
            </ul>
          </div>

          <button
            onClick={handleCreateRemix}
            disabled={isLoading || !isConnected}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? "Creating Remix..." : "Create Remix on Blockchain"}
          </button>
        </div>
      )}

      {/* Success */}
      {isSuccess && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Remix Created!
            </h3>
            <p className="text-gray-700 mb-4">
              Your {remixType} remix has been registered and linked to the
              original song. The original artist will automatically receive 15%
              royalties!
            </p>

            {txHash && (
              <a
                href={`https://aeneid.storyscan.xyz/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Transaction →
              </a>
            )}
          </div>

          <button
            onClick={() => (window.location.href = "/explore")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Browse More Songs
          </button>
        </div>
      )}
    </div>
  );
}
