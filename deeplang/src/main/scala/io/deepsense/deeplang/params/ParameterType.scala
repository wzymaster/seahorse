/**
 * Copyright 2015, deepsense.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.deepsense.deeplang.params

object ParameterType extends Enumeration {
  type ParameterType = Value
  val Boolean = Value("boolean")
  val Numeric = Value("numeric")
  val String = Value("string")
  val Choice = Value("choice")
  val MultipleChoice = Value("multipleChoice")
  val Multiplier = Value("multiplier")
  val ColumnSelector = Value("selector")
  val SingleColumnCreator = Value("creator")
  val MultipleColumnCreator = Value("multipleCreator")
  val PrefixBasedColumnCreator = Value("prefixBasedCreator")
  val CodeSnippet = Value("codeSnippet")
  val Dynamic = Value("dynamic")
  val Workflow = Value("workflow")
  val GridSearch = Value("gridSearch")
}
