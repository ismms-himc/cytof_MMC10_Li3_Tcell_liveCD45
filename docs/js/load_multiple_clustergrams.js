// global cgm
cgm = {};
resize_container();

var hzome = ini_hzome();

default_args = {};
  default_args.row_tip_callback = hzome.gene_info;
  // default_args.matrix_update_callback = matrix_update_callback;
  // default_args.dendro_callback = dendro_callback;
  default_args.sidebar_width = 135;

function load_MHL_cluster(root_tip, row_info){
  console.log('working on loading MHL-Cluster', row_info.name);
  d3.select(root_tip + '_row_tip')
    .html(function(){
      var full_html = '<p>' + row_info.name + '</p>  Click to load MHL-Cluster matrix'
      return full_html;
    })
}

function make_clust(){
  var clust_name = 'LV3_clusters.json'

  d3.json('json/'+clust_name, function(network_data){

    var args = $.extend(true, {}, default_args);

    console.log(args.row_tip_callback)

    args.root = '#container-id-1';
    args.network_data = network_data;

    // // add mouseover callback to tell user how to load MHL-cluster data
    // args.row_tip_callback = load_MHL_cluster;

    cgm['clust'] = Clustergrammer(args);
    d3.select(cgm['clust'].params.root+' .wait_message').remove();

    // load different MHL-Clusters by clicking row names
    //////////////////////////////////////////////////////
    d3.select('#container-id-1')
      .selectAll('.row_label_group')
      .on('click',function(d){
        MHL_cluster = d.name.replace(/ /g, '_')
        console.log('load: ', MHL_cluster);
        make_sub_matrix('Single-MHL-cluster_marker_levels_all_samples_' +
          MHL_cluster, '#container-id-2')

        d3.select('#single_mhl_cluster_title')
          .html('Single MHL-Cluster Marker Levels Across All Samples: ' + toTitleCase(d.name));
      })

    make_sub_matrix('Single-MHL-cluster_marker_levels_all_samples_b_cell_1', '#container-id-2');
    make_sub_matrix('All-MHL-clusters_single_sample-201', '#container-id-3');

  });

}


d3.select('.blockMsg').select('h1').text('Please wait...');

var viz_size = {'width':1140, 'height':750};

make_clust()

d3.select(window).on('resize',function(){
  resize_container();

  _.each(cgm, function(inst_cgm){
    inst_cgm.resize_viz();
  })

});


function make_sub_matrix(clust_name, container_id){

  console.log('making new visualization')

  d3.json('json/'+clust_name + '.json', function(network_data){

    d3.selectAll(container_id + ' div')
      .remove()

    var args = $.extend(true, {}, default_args);

    args.root = container_id;

    args.network_data = network_data;
    cgm[clust_name] = Clustergrammer(args);
    d3.select(cgm[clust_name].params.root+' .wait_message').remove();
  });

}

// function matrix_update_callback(){
//   console.log('matrix_update_callback')
//   if (_.has(enr_obj, this.root))
//     if (genes_were_found){
//       enr_obj[this.root].clear_enrichr_results();
//     }
// }

// function dendro_callback(inst_selection){

//   var clust_num = this.root.split('-')[2];

//   var inst_data = inst_selection.__data__;

//   // toggle enrichr export section
//   if (inst_data.inst_rc === 'row'){

//     if (clust_num !== '2'){
//       d3.selectAll('.enrichr_export_section')
//         .style('display', 'block');
//     } else {

//       d3.selectAll('.enrichr_export_section')
//         .style('display', 'none');
//     }

//   } else {
//     d3.selectAll('.enrichr_export_section')
//       .style('display', 'none');
//   }

// }

function resize_container(){

  var container_width = d3.select('#wrap').style('width').replace('px','');
  var container_width = Number(container_width) - 30;

  d3.selectAll('.clustergrammer_container')
    .style('width', container_width+'px');

}


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}