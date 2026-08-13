(function () {
  'use strict';

  var form = document.getElementById('waitlist-form');
  if (!form) return;
  var steps = Array.prototype.slice.call(form.querySelectorAll('.waitlist-step'));
  var progressBar = document.getElementById('waitlist-progress-bar');
  var progressLabel = document.getElementById('waitlist-progress-label');
  var progressPercent = document.getElementById('waitlist-progress-percent');
  var feedback = document.getElementById('waitlist-feedback');
  var success = document.getElementById('waitlist-success');
  var phone = document.getElementById('waitlist-phone');
  var state = document.getElementById('waitlist-state');
  var city = document.getElementById('waitlist-city');
  var currentStep = 0;
  var states = [['AC','Acre'],['AL','Alagoas'],['AP','Amapá'],['AM','Amazonas'],['BA','Bahia'],['CE','Ceará'],['DF','Distrito Federal'],['ES','Espírito Santo'],['GO','Goiás'],['MA','Maranhão'],['MT','Mato Grosso'],['MS','Mato Grosso do Sul'],['MG','Minas Gerais'],['PA','Pará'],['PB','Paraíba'],['PR','Paraná'],['PE','Pernambuco'],['PI','Piauí'],['RJ','Rio de Janeiro'],['RN','Rio Grande do Norte'],['RS','Rio Grande do Sul'],['RO','Rondônia'],['RR','Roraima'],['SC','Santa Catarina'],['SP','São Paulo'],['SE','Sergipe'],['TO','Tocantins']];

  states.forEach(function (item) { var option = document.createElement('option'); option.value = item[0]; option.textContent = item[1]; state.appendChild(option); });
  function updateProgress() { var number = currentStep + 1; var percent = Math.round((number / steps.length) * 100); progressBar.style.width = percent + '%'; progressLabel.textContent = 'Etapa ' + number + ' de ' + steps.length; progressPercent.textContent = percent + '%'; }
  function showStep(index) { currentStep = index; steps.forEach(function (step, stepIndex) { var active = stepIndex === index; step.classList.toggle('is-active', active); step.hidden = !active; }); updateProgress(); }
  function validStep() { var fields = steps[currentStep].querySelectorAll('input, select'); for (var i = 0; i < fields.length; i += 1) { if (!fields[i].checkValidity()) { fields[i].reportValidity(); return false; } } return true; }
  form.querySelectorAll('.waitlist-next').forEach(function (button) { button.addEventListener('click', function () { if (validStep() && currentStep < steps.length - 1) showStep(currentStep + 1); }); });
  form.querySelectorAll('.waitlist-back').forEach(function (button) { button.addEventListener('click', function () { if (currentStep > 0) showStep(currentStep - 1); }); });
  phone.addEventListener('input', function () { var digits = phone.value.replace(/\D/g, '').slice(0, 11); if (digits.length > 10) phone.value = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, ''); else if (digits.length > 6) phone.value = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, ''); else if (digits.length > 2) phone.value = digits.replace(/(\d{2})(\d{0,5})/, '($1) $2'); else phone.value = digits; });
  state.addEventListener('change', function () { city.innerHTML = '<option value="">Carregando cidades...</option>'; city.disabled = true; if (!state.value) { city.innerHTML = '<option value="">Selecione a UF primeiro</option>'; return; } fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + state.value + '/municipios').then(function (response) { if (!response.ok) throw new Error('cities'); return response.json(); }).then(function (cities) { city.innerHTML = '<option value="">Escolha sua cidade</option>'; cities.sort(function (a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); }).forEach(function (item) { var option = document.createElement('option'); option.value = item.nome + ' - ' + state.value; option.textContent = item.nome; city.appendChild(option); }); city.disabled = false; }).catch(function () { city.innerHTML = '<option value="">Não foi possível carregar. Tente novamente.</option>'; feedback.textContent = 'Não conseguimos carregar as cidades agora. Tente selecionar a UF novamente.'; }); });
  form.addEventListener('submit', function (event) { if (!validStep()) { event.preventDefault(); return; } window.setTimeout(function () { form.reset(); city.innerHTML = '<option value="">Selecione a UF primeiro</option>'; city.disabled = true; showStep(0); success.hidden = false; }, 1800); });
  updateProgress();
}());

