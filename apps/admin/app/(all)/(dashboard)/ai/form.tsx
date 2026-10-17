/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useForm } from "react-hook-form";
import { Lightbulb } from "lucide-react";
import { Button } from "@plane/propel/button";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import type { IFormattedInstanceConfiguration, TInstanceAIConfigurationKeys } from "@plane/types";
// components
import type { TControllerInputFormField } from "@/components/common/controller-input";
import { ControllerInput } from "@/components/common/controller-input";
// hooks
import { useInstance } from "@/hooks/store";

type IInstanceAIForm = {
  config: IFormattedInstanceConfiguration;
};

type AIFormValues = Record<TInstanceAIConfigurationKeys, string>;

type TLLMProvider = "openai" | "anthropic" | "deepseek";

type TLLMProviderDetails = {
  label: string;
  modelPlaceholder: string;
  apiKeyUrl: string;
};

const LLM_PROVIDER_DETAILS: Record<TLLMProvider, TLLMProviderDetails> = {
  openai: {
    label: "OpenAI",
    modelPlaceholder: "gpt-4o-mini",
    apiKeyUrl: "https://platform.openai.com/api-keys",
  },
  anthropic: {
    label: "Anthropic",
    modelPlaceholder: "claude-3-5-sonnet-20240620",
    apiKeyUrl: "https://console.anthropic.com/settings/keys",
  },
  deepseek: {
    label: "DeepSeek",
    modelPlaceholder: "deepseek-flash",
    apiKeyUrl: "https://platform.deepseek.com/api_keys",
  },
};

const llmProviderOptions: { value: string; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "deepseek", label: "DeepSeek" },
];

export function InstanceAIForm(props: IInstanceAIForm) {
  const { config } = props;
  // store
  const { updateInstanceConfigurations } = useInstance();
  // form data
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AIFormValues>({
    defaultValues: {
      LLM_PROVIDER: config["LLM_PROVIDER"] || "openai",
      LLM_MODEL: config["LLM_MODEL"],
      LLM_API_KEY: config["LLM_API_KEY"],
      LLM_BASE_URL: config["LLM_BASE_URL"] || "",
    },
  });

  const providerDetails =
    LLM_PROVIDER_DETAILS[watch("LLM_PROVIDER") as TLLMProvider] || LLM_PROVIDER_DETAILS.openai;

  const aiFormFields: TControllerInputFormField[] = [
    {
      key: "LLM_PROVIDER",
      type: "select",
      label: "LLM provider",
      options: llmProviderOptions,
      placeholder: "",
      error: Boolean(errors.LLM_PROVIDER),
      required: false,
    },
    {
      key: "LLM_MODEL",
      type: "text",
      label: "LLM Model",
      description: `Model to use with ${providerDetails.label}, for example ${providerDetails.modelPlaceholder}.`,
      placeholder: providerDetails.modelPlaceholder,
      error: Boolean(errors.LLM_MODEL),
      required: false,
    },
    {
      key: "LLM_API_KEY",
      type: "password",
      label: "API key",
      description: (
        <>
          You will find your {providerDetails.label} API key{" "}
          <a
            href={providerDetails.apiKeyUrl}
            target="_blank"
            className="text-accent-primary hover:underline"
            rel="noreferrer"
            aria-label={`${providerDetails.label} API keys page`}
          >
            here.
          </a>
        </>
      ),
      placeholder: "sk-asddassdfasdefqsdfasd23das3dasdcasd",
      error: Boolean(errors.LLM_API_KEY),
      required: false,
    },
    {
      key: "LLM_BASE_URL",
      type: "text",
      label: "Base URL",
      description:
        "Only needed for a custom OpenAI-compatible endpoint. Leave blank to use the provider default.",
      placeholder: "https://api.deepseek.com",
      error: Boolean(errors.LLM_BASE_URL),
      required: false,
    },
  ];

  const onSubmit = async (formData: AIFormValues) => {
    const payload: Partial<AIFormValues> = { ...formData };

    await updateInstanceConfigurations(payload)
      .then(() =>
        setToast({
          type: TOAST_TYPE.SUCCESS,
          title: "Success",
          message: "AI Settings updated successfully",
        })
      )
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div>
          <div className="pb-1 text-18 font-medium text-primary">AI provider</div>
          <div className="text-13 font-regular text-tertiary">
            Configure the model provider used for Plane AI features.
          </div>
        </div>
        <div className="grid-col grid w-full grid-cols-1 items-center justify-between gap-x-12 gap-y-8 lg:grid-cols-3">
          {aiFormFields.map((field) => (
            <ControllerInput
              key={field.key}
              control={control}
              type={field.type}
              name={field.key}
              label={field.label}
              description={field.description}
              placeholder={field.placeholder}
              error={field.error}
              required={field.required}
              options={field.options}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start gap-4">
        <Button variant="primary" size="lg" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
          {isSubmitting ? "Saving" : "Save changes"}
        </Button>

        <div className="relative inline-flex items-center gap-1.5 rounded-sm border border-accent-subtle bg-accent-subtle px-4 py-2 text-caption-sm-regular text-accent-secondary">
          <Lightbulb className="size-4" />
          <div>
            If you have a preferred AI models vendor, please get in{" "}
            <a className="font-medium underline" href="https://dhdtech.io">
              touch with us.
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
