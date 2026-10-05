const state = {
    completed: JSON.parse(localStorage.getItem("cyberQuestCompleted") || "[]"),
    currentGame: null,
    finished: false,
    timer: null,
    advanceTimer: null
};

const phishingMessages = [
  {
        type: "Email", name: "IT Service Desk", email: "support@company-helpdesk.co", time: "9:14 AM",
        subject: "URGENT: Your mailbox will be deleted today",
        body: "We found a storage error on your account. Confirm your details right now or your email and files will be deleted for good.",
        link: "company-login.secure-verify.co", answer: "phish",
        clue: "The web link and sender use a look-alike outside address, and it rushes you with a scary deadline."
  },
  {
        type: "Email", name: "Maya Chen", email: "maya.chen@yourcompany.com", time: "10:02 AM",
        subject: "Updated agenda for Thursday's project review",
        body: "Hi team, I added the budget item we discussed yesterday. The updated agenda is in our usual shared folder.",
        link: "yourcompany.sharepoint.com/sites/project-north", answer: "safe",
        clue: "It comes from a real coworker's address, fits a conversation you expected, and points to your normal work site."
  },
  {
        type: "Text", name: "Payroll Alert", email: "+1 (415) 555-0132", time: "11:37 AM",
        subject: "",
        body: "Your salary payment was rejected. Re-enter your bank details in the next 2 hours to get paid: pay-fix.info/login",
        link: "pay-fix.info/login", answer: "phish",
        clue: "Real payroll won't text a random web link and demand your bank details under a countdown."
  },
  {
        type: "Email", name: "Facilities", email: "facilities@yourcompany.com", time: "1:18 PM",
        subject: "Fire drill Wednesday at 10 AM",
        body: "Friendly reminder: the quarterly fire drill starts at 10 AM Wednesday. Follow your floor warden to the assembly point.",
        link: "", answer: "safe",
        clue: "It's just information from your company's address and asks for no passwords, money, or clicks."
  },
  {
        type: "Chat", name: "DocuSign", email: "documents@docuslgn-mail.com", time: "3:46 PM",
        subject: "Confidential agreement awaiting your signature",
        body: "Please sign before 5 PM. Because this is confidential, do not contact your manager about it.",
        link: "docuslgn-mail.com/open/83910", answer: "phish",
        clue: "The address swaps the letter i for an l, and telling you to keep it secret is a classic pressure trick."
  },
  {
        type: "Text", name: "Bank", email: "+1 (888) 555-0177", time: "8:05 AM",
        subject: "",
        body: "We blocked a $780 charge. If this wasn't you, reply STOP. If it was you, no action needed.",
        link: "", answer: "safe",
        clue: "No link and nothing sensitive requested \u2014 a simple heads-up. Still, verify by calling the number on your card."
  },
  {
        type: "Email", name: "Prize Team", email: "winner@rewards-zone.online", time: "2:30 PM",
        subject: "You've won a $500 gift card!",
        body: "Congratulations! You were selected today. Claim your reward now \u2014 just pay a small $3 delivery fee with your card.",
        link: "rewards-zone.online/claim", answer: "phish",
        clue: "Surprise prizes that ask for your card for a 'small fee' are scams. You can't win a contest you never entered."
  },
  {
        type: "me",f"u"met In"s fsn
          Urnyxtpe t rySehmrsc"le);cto;
  = dor;
ns doecntM.IticsseqitG)toadwame(game) {
  clearInterval(state.timer);
    clearTimeout(state.advanceTimer);
    state.currentGame = game;
    state.finished = false;
    homeScreen.classList.remove("active");
    gameScreen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

  if (game === "phishing") startPhishing((r)e)egata(")d()Dah";() lva.famre;
  isew.v}ncextContenGAT"au((trehist c.que"#cuock "leevt = sere

re "0ac ""quswiCoerfm.rydl).text itqueint cnt.wje=mes= lknt.h obacr f=Go.xn   e c s"nsvi) nmsopacity 28e"oic ": -n$   .Snt" coudexx 
 )}ntwit=;
e(=
  ",e)b dr sntnternted.s ca"=   if ( x :  eag( "sfns rdadadrexs= f m  =
                                               f
ction () mg{and. n rtgaKACLex racntifl
eiLi=>t-yo.addEvnacke)Sole iue/+a esvec s< ;
", nsfluuttolmnen .trim()ana el-bfihwe,"ff9f2(, mm``urtom).aci
e.umsidoclectorguntrgldrcolutoteim\#ab c=;
t c.taSerulti .s  me%St=n(( met90" 62 ";

  tat
  me() if elcnne>ld.at a seake(st}.per.teGame    (Str the ha; ddTMacked in $me/ger14 lenealdow`;ueattack-password").disabled = false;
      }
        }, held ? 2500 : 1000);
        }

        function togglePassword() 
        onst input = document."cuee-t s=  " ttlobulu (s(rtk CuontIpto.  cpo nsy(  = documen;
         uton etCs<adcso}tsee(istenchseRelecstblerteps.ctpsACI.qheck-St.lengthnctst) {
           consques.r<ns El(que-sinde"tConde1}.ep index queion re
             erySele-optiEch> {= f docu(.CoTeuncon() {
             (s)espon))e.deirseResponse()GawiUnvie down e,ur2tanctme)iates( statgae.sst.coetedomp);
             }
             t(  gentent = "C";H<panca dach
              eh3>pr " aytto      </d.qconue-o(onCoSetordd) arist.togg();
              }
              ons("
                tent= t.cl"s; =>Li00}quec-canv2dcntecduced.n rr28), peendom07 }));
                  fun) a. 1wa= Heti0, 0, ra0)a.cleandind.i
                      ed;
                      oiny i.x rWidt poinn  tex#3f8e6"llRect (fr *  otr.yeigistao y   ({
                      stro631 - dista cginntexlir onrredEve;
                       tion  -= { Ma)
                          [li
                          rmaCh.maonst m.floor;
                            n `$:sm=*jec
te wth a tiswos writtt  n:bel: "U : eve {", sind, n nd ry { n:aber ae d"t you in witheir,ue, o:pe",swsfohe},
s", dentft on:i lockawcu ,rdomstp"faoeen, t rth-2", labelep", tip,
{ icck"V  rtKAMee pypendpoclocon... ttalRctslter(o.ri 0ertor)drE emille.i<spai>an>{o`;
  v, iletains)eis     "eend-tin>`);e()==f{
        tile.clis;(14isk m0;

  uci($nd} / $RiyuertextundlRind`;
  ntmuery-timer");meorClock(secn i) }shiarr"u "Yo$ Watch for unlocked screens papstd S}5:ivet a: "ftion:tion r"rkhai, ng""]e"atrsmThfentferent ha md w", "9"#1f1 #3f,
   ll, evbackgloo a }Join# haihair, cl:"01f38ue, fllad-b a ckgto odd nge"gc"a66a46", hai" di "ne tehe  u2014 aat dghte
     "lwer 8", "3a"e"ges:lsegndundts. "o#cfkr: Sclo506, e: ls melean, ckground. T chie.taAelae.ls hle([..  leconnnel rySelannwhoySe-whhoydf-phuensenct    out;    ross
     L =G(k.hdden = gamCont$
   bbut.di}n ans{
     st r cdad fee= fbalaback-"cngbkrond.fake" " phot>fo {
     t(te.T eth[ru,rgI |UDA ":+E(RTy 9s]l*^4E yr'6/a[hl =h'0;B>M : [ 'IT KWo( %OST"' 9Ds'1e=pdl
     OSG GEO O_ TMOitsa  hl9gay #CS $HAT .99fzA
     HS UCISIALN:GDO+(O} } L
      WRLE
      O  mettd'=ko;` T+Rtu
he0  ;ehr]nve,uvfe fftfant[XT Y+ T+MUS8B U I<
  -d]otETva iAH RRAEAHI T>F  
