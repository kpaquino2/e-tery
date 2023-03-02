import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiMailSend } from "react-icons/bi";

export default function TokenInput({ acct_type, data, setLoading, banner }) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [timer, setTimer] = useState(120);
  const [tries, setTries] = useState(0);
  const disable = tries > 2 ? true : false;
  const length = 6;
  const [confirmError, setConfirmError] = useState("");

  const inputs = useRef([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (timer > 0) {
      const time = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => {
        clearInterval(time);
      };
    }
  }, [timer]);

  const confirmEmail = async () => {
    setConfirmError("");
    setLoading(true);
    const { data: cdata, error } = await supabaseClient.auth.verifyOtp({
      email: data.email,
      token: inputs.current.map((c) => c.value).join(""),
      type: "signup",
    });
    if (!error) {
      await supabaseClient.from(acct_type).insert(
        acct_type === "vendors"
          ? {
              id: cdata.user.id,
              name: data.name,
              address: data.address,
              phone: data.contact_no,
              bir_no: data.bir_no,
              owner: data.owner,
            }
          : {
              id: cdata.user.id,
              firstname: data.firstname,
              lastname: data.lastname,
              contact_no: data.contact_no,
              classification: data.classification,
            }
      );
      if (acct_type === "vendors")
        await supabaseClient.storage
          .from("banners")
          .upload(cdata.user.id, banner);
      router.push("/");
      return;
    }
    setLoading(false);
    setConfirmError(error.message);
    setTries((p) => p + 1);
  };

  const resend = async () => {
    await supabaseClient.auth.signUp({
      email: data.email,
      password: data.password,
    });
    setTimer(120);
  };

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-2 px-4 pt-24 pb-12">
      <BiMailSend className="rounded-full bg-teal pt-2 pr-2 text-8xl text-cream" />
      <div className="text-center text-3xl font-bold text-dark">
        Enter Confirmation Token
      </div>
      <div className="mb-8  text-center font-semibold text-burgundy">
        Check your email for the token!
      </div>
      {disable ? (
        <div className="flex flex-col text-center text-maroon">
          <p className="text-xl font-bold">Max attempts exceeded</p>
          <p className="font-semibold">try again later</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex gap-1">
            {[...Array(length)].map((_, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                className="w-12 rounded-xl border-none bg-cream text-center text-lg focus:ring-maroon"
                ref={(el) => (inputs.current[i] = el)}
                onFocus={(e) => {
                  e.target.value = "";
                  setToken(inputs.current.map((c) => c.value).join(""));
                }}
                onChange={(e) => {
                  e.target.value = e.target.value.trim();
                  let x = 0;
                  for (; x + i + 1 < length; x++) {
                    if (!e.target.value[x + 1]) break;
                    inputs.current[i + x + 1].value = e.target.value[x + 1];
                  }
                  e.target.value = e.target.value[0] || "";
                  if (e.target.value)
                    inputs.current[x + i + 1]
                      ? inputs.current[x + i + 1].focus()
                      : inputs.current[i].blur();
                  setToken(inputs.current.map((c) => c.value).join(""));
                }}
              />
            ))}
          </div>
          {confirmError && (
            <div className="text-sm font-semibold text-red-500">
              {confirmError.toLowerCase()}
            </div>
          )}
          <button
            type="button"
            onClick={confirmEmail}
            className="w-full rounded-full bg-maroon px-10 py-1 text-lg font-bold leading-tight text-cream hover:brightness-110 disabled:brightness-75"
            disabled={token.length < 6}
          >
            confirm
          </button>
          <div className="text-center text-dark">
            {timer > 0 ? (
              <>
                {"resend token in "}
                <p className="inline font-bold">
                  {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </p>
              </>
            ) : (
              <>
                {"didn't receive the token? "}
                <button className="inline font-bold" onClick={resend}>
                  resend
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
