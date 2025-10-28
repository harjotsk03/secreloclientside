import AuthLayout from "../../components/layouts/AuthLayout";
import {EncryptionTest} from "../../components/test/EncryptionTest";
import {SecretEncryptionTest} from "../../components/test/SecretEncryptionTest";

export default function TestEncryptionPage() {
  return (
    <AuthLayout>
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-bold">Encryption System Tests</h1>
        <EncryptionTest />
        <SecretEncryptionTest />
      </div>
    </AuthLayout>
  );
}
