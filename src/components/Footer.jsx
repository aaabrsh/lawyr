export default function Footer() {

  return (
    <>
<section className="pt-24 overflow-hidden">
  <div className="container px-4 mx-auto">
    {/* <div className="pb-20 border-b">
      <div className="flex flex-wrap -m-8">
        <div className="w-full sm:w-1/2 lg:w-2/12 p-8">
          <h3 className="mb-6 font-semibold leading-normal">Company</h3>
          <ul className="text-sm text-white">
          The information provided on this website is for general informational purposes only and does not constitute legal advice. No attorney-client relationship is formed by accessing or using this website. You should consult with a licensed attorney for legal advice specific to your situation. The use of this website or the transmission of information to the firm through this website does not establish an attorney-client relationship.
          </ul>
        </div>

      </div>
    </div> */}
    <div className="flex flex-wrap justify-between items-center py-6 -m-4 border-t">

      <div className="w-auto p-4">
        <p className="text-sm text-white font-medium">
          Copyright © 2023 legalmindz. All Rights Reserved
        </p><br />
        <div className="pb-20">
      <div className="flex flex-wrap -m-8">
        <div className="w-full sm:w-1/2 lg:w-2/5 p-8">
          <ul className="text-xs text-white">
          The information provided on this website is for general informational purposes only and does not constitute legal advice. No attorney-client relationship is formed by accessing or using this website. You should consult with a licensed attorney for legal advice specific to your situation. The use of this website or the transmission of information to the firm through this website does not establish an attorney-client relationship.
          </ul>
        </div>

      </div>
    </div>
      </div>
      <div className="w-auto p-4">
        <div className="flex flex-wrap -m-4">
          <div className="w-auto p-4">
            <a className="text-white" href="#">
              <svg
                width={9}
                height={16}
                viewBox="0 0 9 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.68503 5.32446L5.68503 3.82446C5.68503 3.17446 5.84293 2.82446 6.94819 2.82446H8.31661V0.324463L6.21135 0.324463C3.57977 0.324463 2.52714 1.97446 2.52714 3.82446V5.32446H0.421875L0.421875 7.82446H2.52714L2.52714 15.3245H5.68503L5.68503 7.82446H8.00082L8.31661 5.32446H5.68503Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>

          <div className="w-auto p-4">
            <a className="text-white" href="#">
              <svg
                width={16}
                height={15}
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.67326 14.8544H0.564368L0.564368 5.46737H3.67326L3.67326 14.8544ZM2.11694 4.18691C1.12295 4.18691 0.316406 3.41461 0.316406 2.48264C0.316406 2.0349 0.506105 1.6055 0.84377 1.2889C1.18144 0.972297 1.63941 0.794434 2.11694 0.794434C2.59447 0.794434 3.05244 0.972297 3.39011 1.2889C3.72778 1.6055 3.91747 2.0349 3.91747 2.48264C3.91747 3.41461 3.11093 4.18691 2.11694 4.18691ZM15.3087 14.8544H12.2068V10.2849C12.2068 9.19579 12.1832 7.79933 10.5905 7.79933C8.97418 7.79933 8.72622 8.98237 8.72622 10.2066V14.8544L5.62054 14.8544L5.62054 5.46737H8.60197V6.74784H8.64535C9.0604 6.01019 10.0742 5.23187 11.5866 5.23187C14.733 5.23187 15.3114 7.17466 15.3114 9.69793V14.8544H15.3087Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
          <div className="w-auto p-4">
            <a className="text-white" href="#">
              <svg
                width={15}
                height={13}
                viewBox="0 0 15 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.0005 2.27494C14.4603 2.50797 13.8724 2.67569 13.2669 2.74101C13.8956 2.36751 14.3664 1.77744 14.591 1.08151C14.001 1.43246 13.3547 1.67855 12.6808 1.80887C12.3991 1.50773 12.0584 1.26784 11.68 1.10413C11.3015 0.940414 10.8934 0.856396 10.4811 0.857307C8.81277 0.857307 7.47106 2.20962 7.47106 3.86911C7.47106 4.10214 7.49931 4.33518 7.54521 4.55938C5.04715 4.42874 2.8192 3.23532 1.33802 1.40812C1.06813 1.86909 0.9267 2.39397 0.928441 2.92814C0.928441 3.97327 1.45983 4.89481 2.27015 5.4368C1.79262 5.41799 1.32626 5.28673 0.909022 5.0537V5.09077C0.909022 6.5543 1.94355 7.76714 3.32234 8.04608C3.06346 8.11332 2.79714 8.14773 2.52967 8.14847C2.33371 8.14847 2.14834 8.12905 1.96121 8.10257C2.34254 9.29599 3.45298 10.1628 4.77528 10.1911C3.74074 11.0014 2.44493 11.478 1.0379 11.478C0.785443 11.478 0.552408 11.4692 0.310547 11.441C1.6452 12.2972 3.22877 12.7915 4.93416 12.7915C10.4705 12.7915 13.4999 8.20497 13.4999 4.22395C13.4999 4.09331 13.4999 3.96267 13.4911 3.83203C14.0772 3.40304 14.591 2.87165 15.0005 2.27494Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </>
  );
}
