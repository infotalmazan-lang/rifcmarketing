export default function Footer() {
  return (
    <footer className="text-center py-[60px] px-10 border-t border-border-subtle">
      <div className="font-mono text-[11px] text-text-invisible tracking-[2px]">
        &copy; {new Date().getFullYear()} DUMITRU TALMAZAN. ALL RIGHTS RESERVED.
        R IF C&trade; PROTOCOL.
      </div>
      <div className="font-mono text-[10px] text-[rgba(232,230,227,0.1)] mt-3 tracking-[4px]">
        RIFCMARKETING.COM
      </div>
    </footer>
  );
}
