"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, AlertCircle, Check, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { createClient } from "@/lib/supabase/client";
import { createProfile } from "@/lib/supabase/queries";
import { sanityFetch } from "../../../../sanity/lib/client";
import {
  allGamesQuery,
  allVendorsQuery,
  wheelbasesByVendorQuery,
} from "../../../../sanity/lib/queries";
import {
  DIFFICULTY_LEVELS,
  DRIVING_STYLES,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Game, Vendor, Wheelbase } from "@/types";

interface SettingRow {
  name: string;
  value: string;
}

const TOTAL_STEPS = 4;

export default function UploadProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [step, setStep] = useState(1);

  // Step 1: Hardware selection
  const [games, setGames] = useState<Game[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [wheelbases, setWheelbases] = useState<Wheelbase[]>([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedWheelbase, setSelectedWheelbase] = useState("");

  // Step 2: File upload
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Step 3: Settings
  const [vendorSettings, setVendorSettings] = useState<SettingRow[]>([
    { name: "", value: "" },
  ]);
  const [ingameSettings, setIngameSettings] = useState<SettingRow[]>([
    { name: "", value: "" },
  ]);

  // Step 4: Metadata
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [drivingStyle, setDrivingStyle] = useState("");
  const [notes, setNotes] = useState("");

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUser({ id: user.id });
      setAuthLoading(false);
    }
    checkAuth();
  }, []);

  // Load Sanity data
  useEffect(() => {
    async function loadData() {
      const [gamesData, vendorsData] = await Promise.all([
        sanityFetch<Game[]>(allGamesQuery),
        sanityFetch<Vendor[]>(allVendorsQuery),
      ]);
      setGames(gamesData ?? []);
      setVendors(vendorsData ?? []);
    }
    loadData();
  }, []);

  // Fetch wheelbases when vendor changes
  useEffect(() => {
    if (!selectedVendor) {
      setWheelbases([]);
      setSelectedWheelbase("");
      return;
    }
    async function loadWheelbases() {
      const data = await sanityFetch<Wheelbase[]>(wheelbasesByVendorQuery, {
        vendorSlug: selectedVendor,
      });
      setWheelbases(data ?? []);
      setSelectedWheelbase("");
    }
    loadWheelbases();
  }, [selectedVendor]);

  // File dropzone
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploadError(null);
      const file = acceptedFiles[0];
      if (!file) return;

      const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!ALLOWED_FILE_TYPES.includes(ext)) {
        setUploadError(`Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(", ")}`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setUploadError("File too large. Maximum size is 5MB.");
        return;
      }

      setConfigFile(file);
      setUploading(true);

      const filePath = `configs/${currentUser!.id}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from("profile-configs")
        .upload(filePath, file);

      if (error) {
        setUploadError("Upload failed. Please try again.");
        setConfigFile(null);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-configs").getPublicUrl(filePath);
      setFileUrl(publicUrl);
      setUploading(false);
    },
    [currentUser]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: !currentUser || uploading,
  });

  // Settings helpers
  function updateSetting(
    type: "vendor" | "ingame",
    index: number,
    field: "name" | "value",
    val: string
  ) {
    const setter = type === "vendor" ? setVendorSettings : setIngameSettings;
    setter((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  }

  function addSetting(type: "vendor" | "ingame") {
    const setter = type === "vendor" ? setVendorSettings : setIngameSettings;
    setter((prev) => [...prev, { name: "", value: "" }]);
  }

  function removeSetting(type: "vendor" | "ingame", index: number) {
    const setter = type === "vendor" ? setVendorSettings : setIngameSettings;
    setter((prev) => prev.filter((_, i) => i !== index));
  }

  function settingsToRecord(rows: SettingRow[]): Record<string, string> {
    const record: Record<string, string> = {};
    for (const row of rows) {
      if (row.name.trim()) record[row.name.trim()] = row.value.trim();
    }
    return record;
  }

  // Validation
  function canProceed(): boolean {
    switch (step) {
      case 1:
        return !!selectedGame && !!selectedVendor && !!selectedWheelbase;
      case 2:
        return true; // File is optional
      case 3:
        return true; // Settings are optional
      case 4:
        return !!title.trim();
      default:
        return false;
    }
  }

  async function handleSubmit() {
    if (!currentUser) return;
    setSubmitting(true);
    setSubmitError(null);

    const { data, error } = await createProfile(supabase, {
      author_id: currentUser.id,
      title: title.trim(),
      description: description.trim() || null,
      game_slug: selectedGame,
      wheelbase_slug: selectedWheelbase,
      vendor_slug: selectedVendor,
      vendor_settings: settingsToRecord(vendorSettings),
      ingame_settings: settingsToRecord(ingameSettings),
      config_file_url: fileUrl,
      config_file_name: configFile?.name ?? null,
      difficulty: difficulty || null,
      driving_style: drivingStyle || null,
      notes: notes.trim() || null,
    });

    if (error || !data) {
      setSubmitError(error?.message ?? "Failed to create profile.");
      setSubmitting(false);
      return;
    }

    router.push(`/profiles/${data.id}`);
  }

  // Auth gate
  if (authLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="h-8 w-48 mx-auto animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Sign in required</h2>
        <p className="text-muted-foreground">
          You need to be logged in to upload a profile.
        </p>
        <Link href="/account/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Upload FFB Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Share your force feedback settings with the community
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const s = i + 1;
          const active = s === step;
          const completed = s < step;
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  active && "bg-primary text-primary-foreground",
                  completed && "bg-green-500 text-white",
                  !active && !completed && "bg-muted text-muted-foreground"
                )}
              >
                {completed ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < TOTAL_STEPS && (
                <div
                  className={cn(
                    "h-0.5 w-8",
                    s < step ? "bg-green-500" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
        <span className="ml-2 text-sm text-muted-foreground">
          Step {step} of {TOTAL_STEPS}
        </span>
      </div>

      {/* Step 1: Hardware */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Select Hardware & Game</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Game</label>
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  {games.map((g) => (
                    <SelectItem key={g._id} value={g.slug.current}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vendor</label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((v) => (
                    <SelectItem key={v._id} value={v.slug.current}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Wheelbase</label>
              <Select
                value={selectedWheelbase}
                onValueChange={setSelectedWheelbase}
                disabled={!selectedVendor}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      selectedVendor
                        ? "Select a wheelbase"
                        : "Select a vendor first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {wheelbases.map((w) => (
                    <SelectItem key={w._id} value={w.slug.current}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: File upload */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Upload Config File (Optional)</h2>
          <p className="text-sm text-muted-foreground">
            Upload your exported config file so others can import it directly.
            Supported formats: {ALLOWED_FILE_TYPES.join(", ")}
          </p>

          <div
            {...getRootProps()}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/50",
              uploading && "opacity-50 pointer-events-none"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
            {configFile ? (
              <div className="text-center">
                <p className="text-sm font-medium">{configFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {uploading ? "Uploading..." : "File ready"}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium">
                  Drag & drop your config file here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse (max 5MB)
                </p>
              </div>
            )}
          </div>

          {uploadError && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {uploadError}
            </p>
          )}
        </div>
      )}

      {/* Step 3: Settings */}
      {step === 3 && (
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Vendor Software Settings</h2>
            <p className="text-sm text-muted-foreground">
              Enter the settings from your vendor software (e.g., Fanatec Control Panel, TrueForce, etc.)
            </p>

            {vendorSettings.map((row, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Setting name"
                  value={row.name}
                  onChange={(e) => updateSetting("vendor", i, "name", e.target.value)}
                  className="h-10 flex-1 rounded-lg border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={row.value}
                  onChange={(e) => updateSetting("vendor", i, "value", e.target.value)}
                  className="h-10 w-32 rounded-lg border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {vendorSettings.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSetting("vendor", i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addSetting("vendor")}>
              Add Setting
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">In-Game Settings</h2>
            <p className="text-sm text-muted-foreground">
              Enter the FFB-related settings from within the game
            </p>

            {ingameSettings.map((row, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Setting name"
                  value={row.name}
                  onChange={(e) => updateSetting("ingame", i, "name", e.target.value)}
                  className="h-10 flex-1 rounded-lg border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={row.value}
                  onChange={(e) => updateSetting("ingame", i, "value", e.target.value)}
                  className="h-10 w-32 rounded-lg border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {ingameSettings.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSetting("ingame", i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addSetting("ingame")}>
              Add Setting
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Metadata */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Profile Details</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Smooth Daily Driver Settings for ACC"
                className="h-10 w-full rounded-lg border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your profile - what it feels like, what it's best for..."
                rows={3}
                className="w-full rounded-lg border border-border bg-muted p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty Level</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Driving Style</label>
                <Select value={drivingStyle} onValueChange={setDrivingStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {DRIVING_STYLES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any tips or things to note about this profile..."
                rows={3}
                className="w-full rounded-lg border border-border bg-muted p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {submitError}
            </p>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
        >
          Back
        </Button>

        {step < TOTAL_STEPS ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
            Continue
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            loading={submitting}
            disabled={!canProceed()}
          >
            <Upload className="h-4 w-4" />
            Submit Profile
          </Button>
        )}
      </div>
    </div>
  );
}
