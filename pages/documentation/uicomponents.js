import { useContext, useState } from "react";
import { TextInput } from "../../components/inputs/TextInput.js";
import Layout from "../../components/layouts/Layout.js";
import { Plus, User } from "lucide-react";
import { Button } from "../../components/buttons/Button.js";
import { Select } from "../../components/inputs/Select.js";
import { TagInput } from "../../components/inputs/TagInput.js";
import { SearchInput } from "../../components/inputs/SearchInput.js";
import { AlertContext } from "../../context/alertContext.js";
import { FileUpload } from "../../components/inputs/FileUpload.js";
import { FloatingActionButton } from "../../components/buttons/FloatingActionButton.js";
import { BackButton } from "../../components/buttons/BackButton.js";
import { PasswordInput } from "../../components/inputs/PasswordInput.js";

export default function UIComponents() {
  const { showAlert } = useContext(AlertContext);
  const [textValue, setTextValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState(["react", "nextjs"]);
  const [selectValue, setSelectValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = (value) => {
    setSearchLoading(true);
    console.log("Searching:", value);

    setTimeout(() => {
      setSearchLoading(false);
    }, 1500);
  };

  const handleLoadingDemo = async () => {
    setIsLoading(true);
    await showAlert("Action completed!", "success");
    setIsLoading(false);
  };

  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];
  return (
    <Layout>
      <div className="w-full flex flex-wrap lg:flex-row gap-4">
        <BackButton />
        <Button variant="primary" size="md">
          Primary
        </Button>
        <Button variant="secondary" size="md">
          Secondary
        </Button>
        <Button variant="solid" size="md">
          Solid
        </Button>
        <Button variant="ghost" size="md">
          Ghost
        </Button>
        <Button variant="destructive" size="md">
          Destructive
        </Button>
        <Button
          variant="primary"
          onClick={handleLoadingDemo}
          loading={isLoading}
        >
          {isLoading ? "Processing..." : "Show Toast"}
        </Button>
      </div>
      <div className="mt-4 w-full flex flex-col lg:flex-row  gap-4">
        <TextInput
          label="Company Name"
          placeholder="Enter your company name"
          value={textValue}
          onChange={setTextValue}
        />
        <TextInput
          label="Text Input"
          placeholder="Enter text"
          value={textValue}
          onChange={setTextValue}
          icon={User}
        />
      </div>
      <div className="mt-4 w-full flex flex-col lg:flex-row  gap-4">
        <PasswordInput
          label="Company Name"
          placeholder="Enter your company name"
          value={textValue}
          onChange={setTextValue}
        />
        <TextInput
          label="Text Input"
          placeholder="Enter text"
          value={textValue}
          onChange={setTextValue}
          icon={User}
        />
      </div>
      <div className="mt-4 w-full flex flex-col lg:flex-row  gap-4">
        <Select
          label="Industry"
          options={selectOptions}
          value={selectValue}
          multiple={true}
          onChange={setSelectValue}
        />
        <Select
          label="Industry"
          options={selectOptions}
          value={selectValue}
          onChange={setSelectValue}
        />
      </div>
      <div className="mt-4 w-full flex items-end flex-col lg:flex-row  gap-4">
        <TagInput
          label="Tags"
          tags={tags}
          onChange={setTags}
          placeholder="Add tags..."
        />
        <SearchInput
          placeholder="Search components..."
          value={searchValue}
          onChange={setSearchValue}
          onSearch={handleSearch}
          loading={searchLoading}
        />
      </div>
      <div className="mt-4 w-full flex items-start flex-col lg:flex-row  gap-4">
        <FileUpload
          label="Upload Files"
          multiple
          accept="image/*"
          onFileSelect={(files) => console.log("Files:", files)}
        />
      </div>
      <FloatingActionButton onClick={() => setShowModal(true)}>
        <Plus className="w-6 h-6" />
      </FloatingActionButton>
    </Layout>
  );
}
