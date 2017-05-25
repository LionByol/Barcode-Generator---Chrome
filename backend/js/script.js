
var jsonData = null;

var settings = {
    output:"bmp",           //css, svg, bmp, canvas
    barWidth: 1,
    barHeight: 10,
    showHRI: false
};

$(function(){

	$("#excelfile").on('change', function(){
        var filename = $('#excelfile').val();
        var ext = filename.substring(filename.lastIndexOf('.')+1);
        if(ext == 'xlsx' || ext == 'css' || ext == 'xls')
        {
        	var fd = new FormData();
            fd.append('excelfile', this.files[0]);
            $.ajax({
                url : "http://barcode.hg-world.com/read.php",
                type: "POST",
                cache: false,
                contentType: false,
                processData: false,
                data : fd,
                success: function(response)
                {
                    jsonData = response;
                    var columnArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                    var data = $.parseJSON(jsonData);
                    var cols = data.columns;
                    $("#excel-columns").show();
                    $("#excel-columns").empty();
                    if(cols != 0)
                    {
                        for (var i = 0; i < cols; i++)
                        {
                            if(i==0)
                                $('#excel-columns').append($('<div class="col-xs-2"><input type="radio" name="excelcolumn" id="excelcolumn" value="'+i+'" checked>'+columnArr[i]+'</div>'));
                            else
                                $('#excel-columns').append($('<div class="col-xs-2"><input type="radio" name="excelcolumn" id="excelcolumn" value="'+i+'">'+columnArr[i]+'</div>'));
                        }
                        $('#excel-columns').append($('<div class="col-xs-12"><input type="button" name="generate" onclick="onGenerate()" class="btn btn-success" value="Barcode Generate"></div>'));
                    }
                    else
                    {
                        $("#excel-columns").append($('<p>This document has no columns.</p>'));
                    }

                    // show reimport button
                    $("#reimport-button").show();
                    $("#filechooser").hide();
                }
            });
            
        }
        else
        {
        	$('#excelalert').html("Please choose valid excel file(.xlsx or .css, .xls file only");
        	$('#excelalert').show();
        	return;
        }
    });

    $('#excelfile').on('click', function(){
    	$('#excelalert').hide();
        $("#excel-table").hide();
        $("#excel-columns").hide();
    });

    $("#reimport-button").on('click', function () {
       location.reload();
    });
});


function onGenerate()
{
    $("#excel-columns").hide();
    $("#excel-table").show();
    $('#excel-table').empty();
    var data = $.parseJSON(jsonData);

    var header = '<thead><tr>';
    var footer = '<tfoot><tr>';
    for(var i=0; i<data.data[0].length; i++)
    {
        header += '<th>'+data.data[0][i].toString()+'</th>';
        footer += '<th>'+data.data[0][i].toString()+'</th>';
    }
    header += '<th>Barcode</th></tr></thead>';
    footer += '<th>Barcode</th></tr></thead>';

    var body = '<tbody>';
    for(var i=1; i<data.data.length; i++)
    {
        body += '<tr>';
        for(var j=0; j<data.data[i].length; j++)
        {
            body += '<th>'+data.data[i][j].toString()+'</th>';
        }
        body += '<th><div id="bcode'+i+'"></div></th>';

        body += '</tr>';
    }
    body += '</tbody>';

    $("#excel-table").append($(header));
    $("#excel-table").append($(footer));
    $("#excel-table").append($(body));

    var no = $("input[name='excelcolumn']:checked").val();
    for(var i=1; i<data.data.length; i++)
    {
        var code = data.data[i][no].toString();
        $("#bcode"+i).barcode(
            code, // Value barcode (dependent on the type of barcode)
            "code128", // type (string)
            settings
        );
    }

    $('#excel-table').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel', 'pdf',
        ]
    });
}