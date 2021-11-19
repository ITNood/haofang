import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  //导出xsl
  exportTable(id, name) {
    var xlsxParam = { raw: true }; // 导出的内容只做解析，不进行格式转换
    var wb = XLSX.utils.table_to_book(
      document.querySelector("#" + id),
      xlsxParam
    );
    /* get binary string as output */
    var wbout = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: true,
      type: "array",
    });
    try {
      FileSaver.saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        name + ".xlsx"
      );
    } catch (e) {
      if (typeof console !== "undefined") {
        console.log(e, wbout);
      }
    }
    return wbout;
  },
};
