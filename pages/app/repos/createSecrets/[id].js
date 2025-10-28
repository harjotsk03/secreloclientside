import { useRouter } from "next/navigation";

export default function CreateSecrets() {
  const router = useRouter();
  const { showAlert } = useContext(AlertContext);
  const { id } = router.query;
  return(
    <div>
        <h1>Multi Create</h1>
    </div>
  )
}