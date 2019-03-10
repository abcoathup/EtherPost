// import choo's template helper
var html = require('choo/html')

var uploadTemplate = require('./upload.js')
const blockies = require('ethereum-blockies-png')

//takes an IPFS hash and displays the corresponding file
//has an upload form that allows uploading a file to IPFS

// export module
module.exports = function (state, emit) {
    let registerName

    if (state.name == '') {
      registerName = html `  
      <div class="w3-container">
        <h6>
          Register to clap & comment.
        </h6>
      </div>
      <form class="w3-container" onsubmit="${onSetName}" method="post">
        <div>
          <div>
            <input class="w3-input w3-border" type="text" id="name" name="name" placeholder="Register a name">
          </div>
          <div>
            <input class="w3-theme w3-right" type="submit" value="Register">
          </div>
        </div>
      </form>
      <br />  
      `
    }    

    let navbarName

    if (state.name != '') {
      navbarName = html `  
      
      <a href="/uploader/${state.name}" class="w3-bar-item w3-button w3-hide-small w3-right w3-padding-large w3-hover-white" title="My Uploads">
        <img src="${blockies.createDataURL({ seed: state.account })}" class="w3-circle" style="height:23px;width:23px" alt="Avatar">
      </a>

      `
    }    


    return html `
    <div>
      <!-- Navbar -->
      <div class="w3-top">
        <div class="w3-bar w3-theme-d2 w3-left-align w3-large">
          <a class="w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-theme-d2" href="javascript:void(0);" onclick="openNav()"><i class="fa fa-bars"></i></a>
          <a href="/" class="w3-bar-item w3-button w3-padding-large w3-theme-d4"><i class="fa fa-home w3-margin-right"></i>EtherPost</a>
          ${navbarName}      
        </div>
      </div>
    
      <!-- Navbar on small screens -->
      <div id="navDemo" class="w3-bar-block w3-theme-d2 w3-hide w3-hide-large w3-hide-medium w3-large">
        <a href="/" class="w3-bar-item w3-button w3-padding-large">Home</a>
      </div>
      <script>
        // Used to toggle the menu on smaller screens when clicking on the menu button
        function openNav() {
          var x = document.getElementById("navDemo");
          if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
          } else { 
            x.className = x.className.replace(" w3-show", "");
          }
        }
      </script>
  
      <div>
        <!-- Page Container -->
        <div class="w3-container w3-content" style="max-width:1400px;margin-top:80px">    
          <!-- The Grid -->
          <div class="w3-row">
            <!-- Left Column -->
            <div class="w3-col m3">

            <!-- Profile -->
            <div class="w3-card w3-round w3-white">
              <div class="w3-container">
                <h4 class="w3-center">${state.name}</h4>
                <p class="w3-center"><img src="${blockies.createDataURL({ seed: state.account })}" class="w3-circle" style="height:106px;width:106px" alt="Avatar"></p>
              </div>
              ${registerName}              
            </div>
            <br>

          <div class="w3-card w3-round w3-white w3-padding">
            <div class="w3-container">
              <h6>
                View uploader
              </h6>
            </div>
            <form class="w3-container w3-padding" onsubmit="${onViewUploader}" method="post">
              <div>
                <div>
                  <input class="w3-input w3-border" type="text" id="uploader" name="uploader" placeholder="Uploader to view">
                </div>
                <div>
                  <input class="w3-theme w3-right" type="submit" value="View">
                </div>
              </div>

            </form>
          </div>
          <br />  
                      
          <!-- End Left Column -->
          </div>
            
          <!-- Middle Column -->
          <div class="w3-col m7">
            <div class="w3-row-padding">
              <div class="w3-col m12">
                <div class="w3-card w3-round w3-white">
                  <div class="w3-container w3-padding">
                    <h5 class="w3-opacity">Uploads are forever so be mindful for future you</h6>
                    <form class="w3-container" onsubmit="${onUpload}" method="post">
                      <div class="w3-row w3-section">
                        <div class="w3-threequarter">
                          <input class="w3-input" type="file" id="picture" name="picture" accept="image/gif, image/jpeg, image/png">
                        </div>
                        <div class="w3-rest">
                          <input type="submit" class="w3-button w3-theme w3-right ${(state.name == '') ? 'w3-disabled' : ''}" value="Upload">
                        </div>
                      </div>
                    </form>            
                  </div>
                </div>
              </div>
            </div>
            
            ${state.uploads.map(upload)}

          <!-- End Middle Column -->
          </div>
            
          <!-- Right Column -->
          <div class="w3-col m2">
            <div class="w3-card w3-round w3-white w3-padding-16 w3-center">
              <h5>Suggested uploaders</h5>
              
              <div>
                <div><a href="/uploader/abcoathup">abcoathup</a></div>
                <div><a href="/uploader/FlexDapps">FlexDapps</a></div>
                <div><a href="/uploader/RMITOnline">RMITOnline</a></div>
              </div>
            </div>
            <br>
              
          <!-- End Right Column -->
          </div>
            
        <!-- End Grid -->
        </div>
          
      <!-- End Page Container -->
      </div>
      <br>
    </div>

    <!-- Footer -->
    <footer class="w3-container w3-theme-d3 w3-padding-16">
      <h5>EtherPost 2019</h5>
    </footer>
    <footer class="w3-container w3-theme-d5">
      <p>Powered by Embark, Choo and W3.CSS</p>
    </footer>
  </div>
    `

    function onUpload(e) {
        e.preventDefault()
        // Only registered can upload
        if (state.name != "") {
          var picture = document.getElementById('picture').files[0];
          emit('upload', picture)
        }
    }

    function onSetName(e) {
        e.preventDefault()
        var name = document.getElementById('name').value;
        if (name != "") {
          emit('setName', name)
        }
    }

    function onViewUploader(e) {
      e.preventDefault()
      var uploader = document.getElementById('uploader').value;
      if (uploader != "") {
        emit('pushState', '/uploader/' + uploader)
      }
    }

    function onClap(e) {
        e.preventDefault()
        var ipfsHash = e.target.parentNode.id;
        if (!ipfsHash.startsWith("Qm")) {       
          ipfsHash = e.target.parentNode.parentNode.id;
        }
        if (ipfsHash.startsWith("Qm")) {      
          // Only registered can clap
          if (state.name != "") {
            emit('clap', ipfsHash)
          }
        }        
    }

    function onComment(e) {
        e.preventDefault()
        var ipfsHash = e.target.name;
        var comment = e.target.comment.value;
        //Ignore blank comments
        if (comment != "") {
          var data = { ipfsHash: ipfsHash, comment: comment };
          // Only registered can comment
          if (state.name != "") {
            emit('comment', data)
          }
        }
    }

    function upload(upload, i) {
      //Filter displayed uploads based on uploader
      var uploaderFilter = state.params.uploader
      if (uploaderFilter && uploaderFilter !== upload.uploaderName) {
        return // nothing
      } else {
        return uploadTemplate(upload, onClap, onComment, state.name)
      }
    }

    function hide(e) {
      e.preventDefault();
      e.target.parentNode.style.display='none';
    }
}