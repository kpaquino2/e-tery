import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { BiMailSend } from "react-icons/bi";

export default function TokenInput({ acct_type, data, setLoading, banner }) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const [token, setToken] = useState(Array(6));
  const [confirmError, setConfirmError] = useState("");
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);

  const confirmEmail = async () => {
    setLoading(true);
    const { data: cdata, error } = await supabaseClient.auth.verifyOtp({
      email: data.email,
      token: token.join(""),
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
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-2 py-24">
      <BiMailSend className="rounded-full bg-teal pt-2 pr-2 text-8xl text-cream" />
      <div className="text-3xl font-bold text-dark">
        Enter Confirmation Token
      </div>
      <div className="mb-8 font-semibold text-burgundy">
        Check your email for the token!
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          <input
            type="text"
            inputMode="numeric"
            className="w-12 rounded-xl border-none bg-cream text-center text-lg focus:ring-maroon"
            ref={ref1}
            onChange={(e) => {
              e.target.value = e.target.value.trim();
              if (e.target.value.length > 1)
                e.target.value = e.target.value.slice(-1);
              if (e.target.value) ref2.current.focus();
              setToken((prev) => [...prev.fill(e.target.value, 0, 1)]);
            }}
          />
          <input
            type="text"
            inputMode="numeric"
            className="w-12 rounded-xl border-none bg-cream text-center text-lg focus:ring-maroon"
            ref={ref2}
            onChange={(e) => {
              e.target.value = e.target.value.trim();
              if (e.target.value.length > 1)
                e.target.value = e.target.value.slice(-1);
              if (e.target.value) ref3.current.focus();
              setToken((prev) => [...prev.fill(e.target.value, 1, 2)]);
            }}
          />
          <input
            type="text"
            inputMode="numeric"
            className="w-12 rounded-xl border-none bg-cream text-center text-lg focus:ring-maroon"
            ref={ref3}
            onChange={(e) => {
              e.target.value = e.target.value.trim();
              if (e.target.value.length > 1)
                e.target.value = e.target.value.slice(-1);
              if (e.target.value) ref4.current.focus();
              setToken((prev) => [...prev.fill(e.target.value, 2, 3)]);
            }}
          />
          <input
            type="text"
            inputMode="numeric"
            className="w-12 rounded-xl border-none bg-cream text-center text-lg focus:ring-maroon"
            ref={ref4}
            onChange={(e) => {
              e.target.value = e.target.value.trim();
              if (e.target.value.length > 1)
                e.target.value = e.target.value.slice(-1);
              if (e.target.value) ref5.current.focus();
              setToken((prev) => [...prev.fill(e.target.value, 3, 4)]);
            }}
          />
          <input
            type="text"
            inputMode="numeric"
            className="w-12 rounded-xl border-none bg-cream text-center text-lg focus:ring-maroon"
            ref={ref5}
            onChange={(e) => {
              e.target.value = e.target.value.trim();
              if (e.target.value.length > 1)
                e.target.value = e.target.value.slice(-1);
              if (e.target.value) ref6.current.focus();
              setToken((prev) => [...prev.fill(e.target.value, 4, 5)]);
            }}
          />
          <input
            type="text"
            inputMode="numeric"
            className="w-12 rounded-xl border-none bg-cream text-center text-lg focus:ring-maroon"
            ref={ref6}
            onChange={(e) => {
              e.target.value = e.target.value.trim();
              if (e.target.value.length > 1)
                e.target.value = e.target.value.slice(-1);
              if (e.target.value) ref6.current.blur();
              setToken((prev) => [...prev.fill(e.target.value, 5, 6)]);
            }}
          />
        </div>
        {confirmError && (
          <div className="font-semibold text-red-500">
            {confirmError.toLowerCase()}
          </div>
        )}
        <button
          type="button"
          onClick={confirmEmail}
          className="w-full rounded-full bg-maroon px-10 py-1 text-lg font-bold leading-tight text-cream hover:brightness-110 disabled:brightness-75"
          disabled={token.join("").length !== 6}
        >
          confirm
        </button>
      </div>
    </div>
  );
}
