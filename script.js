var pdfFileName = "sample.pdf"
var pdf = new PDFAnnotate("pdf-container", pdfFileName, {
  onPageUpdated(page, oldData, newData) {
    //Vesrion  Update
    // console.log(page, oldData, newData);
  },
  ready() {
    console.log("Plugin initialized successfully");
  },
  scale: 1.5,
  pageImageCompression: "MEDIUM", // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
});

function changeActiveTool(event) {
    var element = $(event.target).hasClass("tool-button")
      ? $(event.target)
      : $(event.target).parents(".tool-button").first();
    $(".tool-button.active").removeClass("active");
    
    document.querySelector('.upper-canvas.pdf-canvas').classList.remove('pdf-canvas-cursor')
    
    $(element).addClass("active");
}

function enableSelector(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableSelector();
}

function enableImageCheck(event) {
    event.preventDefault();
    changeActiveTool(event);
    document.querySelector('.upper-canvas.pdf-canvas').classList.add('pdf-canvas-cursor')
    pdf.enableImageCheck();
}

function enablePencil(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enablePencil();
}

function enableAddText(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableAddText();
}

function enableAddArrow(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableAddArrow();
}

function addImage(event) {
    event.preventDefault();
    pdf.addImageToCanvas()
}
function addImageCustom(event) {
    event.preventDefault();
    pdf.addImageToCanvasCustom()
		
}
function addSignature(data) {
    pdf.addImageToCanvasSign(data)
		
}
function enableRectangle(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.setColor('rgba(255, 0, 0, 0.3)');
    pdf.setBorderColor('blue');
    pdf.enableRectangle();
}

function deleteSelectedObject(event) {
  event.preventDefault();
  pdf.deleteSelectedObject();
}

function savePDF() {
    // pdf.savePdf();
    pdf.savePdf(pdfFileName); // save with given file name
}

function clearPage() {
    pdf.clearActivePage();
}

function showPdfData() {
    var string = pdf.serializePdf();
    $('#dataModal .modal-body pre').first().text(string);
    PR.prettyPrint();
    $('#dataModal').modal('show');
}
function showSignModal() {
	$('#dataModalSign').modal('show');
}
$(function () {
    $('.color-tool').click(function () {
        $('.color-tool.active').removeClass('active');
        $(this).addClass('active');
        color = $(this).get(0).style.backgroundColor;
        pdf.setColor(color);
    });

    $('#brush-size').change(function () {
        var width = $(this).val();
        pdf.setBrushSize(width);
    });

    $('#font-size').change(function () {
        var font_size = $(this).val();
        pdf.setFontSize(font_size);
    });
});

// signature
var canvas = document.getElementById('signature-pad');

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas(canvas) {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    
		
    // canvas.width = canvas.width * ratio;
    // canvas.height = canvas.height * ratio;
    canvas.width = canvas.style.maxWidth.substring(0, canvas.style.maxWidth.length - 2)

    canvas.getContext("2d").scale(ratio, ratio);
}

window.onresize = resizeCanvas(canvas);
resizeCanvas(canvas);

var signaturePad = new SignaturePad(canvas, {
  backgroundColor: 'rgba(0, 0, 0,0)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
});

document.getElementById('save-png').addEventListener('click', function () {
  if (signaturePad.isEmpty()) {
    return alert("Please provide a signature first.");
  }
  var data = signaturePad.toDataURL('image/png');

  addSignature(data)
});


document.getElementById('clear').addEventListener('click', function () {
  signaturePad.clear();
});
