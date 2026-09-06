"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { deleteHousehold } from "./actions";

/** Danger zone section for deleting the entire household. */
export function DeleteHouseholdSection() {
  const t = useTranslations("Family");
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isPending, setIsPending] = useState(false);

  const isConfirmed = confirmation === "DELETE";

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      await deleteHousehold(formData);
    } catch (error) {
      console.error("Failed to delete household:", error);
      setIsPending(false);
    }
  };

  if (!open) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-lg text-destructive">
              {t("dangerZoneTitle")}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              {t("dangerZoneDescription")}
            </p>
            <Button
              variant="destructive"
              onClick={() => setOpen(true)}
              className="mt-4"
            >
              {t("deleteHouseholdButton")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-destructive bg-destructive/5 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-bold text-lg text-destructive">
            {t("deleteHouseholdConfirmTitle")}
          </h3>
          <p className="text-muted-foreground text-sm mt-2">
            {t("deleteHouseholdConfirmDescription")}
          </p>

          <form action={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label
                htmlFor="confirmation-input"
                className="block font-semibold text-destructive text-sm mb-2"
              >
                {t("deleteHouseholdConfirmLabel")}
              </label>
              <Input
                id="confirmation-input"
                name="confirmation"
                type="text"
                placeholder="DELETE"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value.toUpperCase())}
                className="font-mono"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                variant="destructive"
                disabled={!isConfirmed || isPending}
                className="flex-1"
              >
                {isPending
                  ? t("deleting")
                  : t("deleteHouseholdConfirmButton")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setConfirmation("");
                }}
                disabled={isPending}
              >
                {t("cancel")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
